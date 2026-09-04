/**
 * Payment Lifecycle Service
 *
 * The backend/database is the single source of truth for the payment state
 * machine. All transitions are atomic, guarded updates so concurrent requests
 * (multiple tabs, duplicate "Pay" clicks, expiry races, gateway retries)
 * cannot produce duplicate or contradictory states.
 *
 * Lifecycle:
 *
 *   Pending ──(Pay clicked)─────▶ PaymentInitiated ──(middleman received)──▶ PaymentReceived
 *      │                                    │                                       │
 *      │ 5-min expiry                       │ money deducted but NOT received        │ 20-second receipt
 *      ▼                                    │ (attempt later determined failed)      │ grace period
 *   Expired ◀───────────────────────────────┘                                       ▼
 *      │                                                                          Success (receipt)
 *      └────────────────── Failed (simulated network failure) ◀─────────────────────┘
 *
 * - "PaymentInitiated" means the user clicked Pay. It NEVER means the payment
 *   was received.
 * - "PaymentReceived" is set only by the middleman-confirmation path
 *   (server-side), never by the frontend.
 * - "Success" (existing project convention) is reached only via
 *   PaymentReceived + 20-second grace → receipt generated.
 */
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const ExamRegistration = require("../models/ExamRegistration");
const Student = require("../models/Student");
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");
const createAuditLog = require("../utils/createAuditLog");

// ---------------------------------------------------------------------------
// Configuration (env-tunable; defaults match the product spec)
// ---------------------------------------------------------------------------
const PAYMENT_SESSION_MS = () =>
  Math.max(1000, parseInt(process.env.PAYMENT_SESSION_MS, 10) || 5 * 60 * 1000);

const RECEIPT_GRACE_MS = () =>
  Math.max(0, parseInt(process.env.RECEIPT_GRACE_MS, 10) || 20 * 1000);

const GATEWAY_PROCESSING_MS = () =>
  Math.max(500, parseInt(process.env.GATEWAY_PROCESSING_MS, 10) || 8 * 1000);

const SWEEP_INTERVAL_MS = () =>
  Math.max(1000, parseInt(process.env.PAYMENT_SWEEP_INTERVAL_MS, 10) || 5 * 1000);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const computeReceiptNumber = (payment) =>
  `RCPT${new Date().getFullYear()}${payment.paymentNumber.slice(-5)}`;

const isConnected = () =>
  !!mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Build the session payload the frontend displays. Everything is anchored on
 * the server clock so a refresh, new tab, or offline period cannot fake it.
 */
const buildSessionPayload = (payment, now = new Date()) => {
  const expiresAt = payment.expiresAt ? new Date(payment.expiresAt) : null;
  const receivedAt = payment.paymentReceivedAt
    ? new Date(payment.paymentReceivedAt)
    : null;

  let timeRemainingMs = 0;
  if (expiresAt && ["Pending", "PaymentInitiated"].includes(payment.status)) {
    timeRemainingMs = Math.max(0, expiresAt.getTime() - now.getTime());
  }

  let receiptGraceRemainingMs = null;
  if (payment.status === "PaymentReceived" && receivedAt) {
    receiptGraceRemainingMs = Math.max(
      0,
      receivedAt.getTime() + RECEIPT_GRACE_MS() - now.getTime()
    );
  }

  return {
    serverTime: now.toISOString(),
    status: payment.status,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    timeRemainingMs,
    sessionDurationMs: PAYMENT_SESSION_MS(),
    receiptGraceRemainingMs,
    receiptGracePeriodMs: RECEIPT_GRACE_MS(),
    receiptGeneratedAt: payment.receiptGeneratedAt
      ? payment.receiptGeneratedAt.toISOString()
      : null,
    receiptNumber: payment.receiptNumber || null,
  };
};

// ---------------------------------------------------------------------------
// Expiry
// ---------------------------------------------------------------------------

/**
 * Pending/PaymentInitiated sessions that have passed `expiresAt` are marked
 * Expired. Atomic + guarded: an already Received/Success payment can never be
 * expired, and an Expired payment can never become payable again.
 */
const expirePayment = async (payment) => {
  const now = new Date();
  const expiresAt = payment.expiresAt ? new Date(payment.expiresAt) : null;

  if (!expiresAt || !["Pending", "PaymentInitiated"].includes(payment.status)) {
    return payment;
  }

  if (now.getTime() < expiresAt.getTime()) {
    return payment;
  }

  const updated = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: { $in: ["Pending", "PaymentInitiated"] },
    },
    {
      $set: { status: "Expired", expiredAt: now },
      $unset: { simulation: 1 },
    },
    { new: true }
  );

  if (updated) {
    await createAuditLog(
      payment.studentId,
      "Payment Expired",
      "Payment session expired without confirmation",
      "Warning"
    ).catch(() => {});
  }

  return updated || payment;
};

/**
 * Lazy-expire a single payment if it is overdue (used by controllers on every
 * read, so the backend is always authoritative).
 */
const expirePaymentIfNeeded = async (payment) => {
  const now = new Date();
  const expiresAt = payment.expiresAt ? new Date(payment.expiresAt) : null;

  if (
    expiresAt &&
    ["Pending", "PaymentInitiated"].includes(payment.status) &&
    now.getTime() >= expiresAt.getTime()
  ) {
    return expirePayment(payment);
  }

  return payment;
};

/**
 * Sweep: expire every overdue unpaid session (no user request required).
 */
const expireOverdueSessions = async () => {
  const now = new Date();

  const result = await Payment.updateMany(
    {
      status: { $in: ["Pending", "PaymentInitiated"] },
      expiresAt: { $lte: now },
    },
    { $set: { status: "Expired", expiredAt: now } }
  );

  return result.modifiedCount || 0;
};

// ---------------------------------------------------------------------------
// Initiation (user clicked "Pay")
// ---------------------------------------------------------------------------

/**
 * Marks a Pending payment as PaymentInitiated (user clicked Pay).
 *
 * This is deliberately NOT a success — settlement only happens in
 * confirmGatewayReceipt. Falls back gracefully if another tab already
 * initiated (idempotent) and rejects final/expired sessions.
 */
const initiatePayment = async (payment, { simulation } = {}) => {
  const now = new Date();

  const current = await expirePaymentIfNeeded(payment);

  if (current.status === "Expired") {
    return { ok: false, code: "EXPIRED", payment: current };
  }
  if (["Success", "Failed", "PaymentReceived"].includes(current.status)) {
    return { ok: false, code: "ALREADY_FINAL", payment: current };
  }

  const updated = await Payment.findOneAndUpdate(
    {
      _id: current._id,
      status: "Pending",
      expiresAt: { $gte: now },
    },
    {
      $set: {
        status: "PaymentInitiated",
        paymentInitiatedAt: now,
        simulation:
          simulation === "network-failure" ? "network-failure" : null,
      },
    },
    { new: true }
  );

  if (!updated) {
    // Another tab got here first, or the session just expired.
    const latest = await expirePaymentIfNeeded(
      await Payment.findById(current._id)
    );
    return { ok: false, code: "CONFLICT", payment: latest };
  }

  return { ok: true, code: "INITIATED", payment: updated };
};
// ---------------------------------------------------------------------------
// Middleman confirmation (payment was actually received)
// ---------------------------------------------------------------------------

/**
 * The mock middleman confirms that it received the funds.
 *
 * Atomic guard: only PaymentInitiated → PaymentReceived while the session is
 * still valid (now <= expiresAt), so an Expired payment can never become
 * Received, and a Received payment can never be overwritten by expiry.
 */
const confirmGatewayReceipt = async (payment, receivedAt = new Date()) => {
  const updated = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "PaymentInitiated",
      expiresAt: { $gte: receivedAt },
    },
    {
      $set: {
        status: "PaymentReceived",
        paymentReceivedAt: receivedAt,
      },
    },
    { new: true }
  );

  if (updated) {
    await createAuditLog(
      updated.studentId,
      "Payment Received",
      "Payment received by payment system"
    ).catch(() => {});
  }

  return updated;
};

/**
 * Mark a PaymentInitiated attempt as Failed (money may have been deducted but
 * the middleman never received / network failure). Atomic & guarded.
 */
const failPayment = async (payment, failedAt = new Date()) => {
  const updated = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "PaymentInitiated",
    },
    { $set: { status: "Failed", failedAt } },
    { new: true }
  );

  if (updated) {
    await createAuditLog(
      updated.studentId,
      "Payment Failed",
      "Payment could not be confirmed"
    ).catch(() => {});
  }

  return updated;
};

/**
 * Drives the mock middleman for every initiated payment.
 *
 * Once a payment has been processing longer than GATEWAY_PROCESSING_MS (and
 * is still within its session), the middleman confirms receipt — or, for
 * simulation "network-failure", reports that the funds never arrived (the
 * payment then stays PaymentInitiated until expiry, or is failed directly).
 *
 * Runs server-side so the payment is confirmed even if the user's browser was
 * closed/lost connectivity, and it also reconciles after server restarts.
 */
const processGatewayConfirmations = async () => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - GATEWAY_PROCESSING_MS());

  const initiated = await Payment.find({
    status: "PaymentInitiated",
    paymentInitiatedAt: { $lte: cutoff },
  });

  let processed = 0;
  for (const payment of initiated) {
    if (payment.simulation === "network-failure") {
      const failed = await failPayment(payment, now);
      if (failed) processed += 1;
      continue;
    }

    const received = await confirmGatewayReceipt(payment, now);
    if (received) processed += 1;
  }

  return processed;
};
// ---------------------------------------------------------------------------
// Receipt finalization (after the 20-second grace period)
// ---------------------------------------------------------------------------

/**
 * Finalize a received payment into Success + "generate receipt" once the
 * 20-second grace period has elapsed.
 *
 * Idempotency: the guarded status transition ("PaymentReceived" only, plus
 * receiptGeneratedAt: null) is the lock — exactly one concurrent caller wins,
 * so receiptNumber/receiptGeneratedAt are written exactly once per payment.
 * Side effects (registration update, confirmation email, audit) re-use the
 * existing downstream flow.
 */
const finalizeReceipt = async (payment) => {
  const now = new Date();
  const receivedAt = payment.paymentReceivedAt
    ? new Date(payment.paymentReceivedAt)
    : null;

  if (payment.status !== "PaymentReceived" || !receivedAt) return payment;

  const graceEnd = receivedAt.getTime() + RECEIPT_GRACE_MS();
  if (now.getTime() < graceEnd) {
    // Grace period is still running — receipt must wait.
    return payment;
  }

  const updated = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "PaymentReceived",
      receiptGeneratedAt: null,
    },
    {
      $set: {
        status: "Success",
        paidAt: payment.paymentReceivedAt || now,
        receiptNumber: computeReceiptNumber(payment),
        receiptGeneratedAt: now,
      },
    },
    { new: true }
  );

  if (!updated) {
    // Already finalized by another caller/tab, or a duplicate request.
    return payment;
  }

  // --- Existing downstream success flow (unchanged) ---
  const registration = await ExamRegistration.findByIdAndUpdate(
    updated.registrationId,
    { status: "Registered", paymentId: updated._id },
    { new: true }
  );

  const student = await Student.findById(updated.studentId);

  try {
    await sendPaymentConfirmation({
      student,
      registration,
      payment: updated,
    });
  } catch (err) {
    console.error("Email Error:", err);
  }

  await createAuditLog(
    updated.studentId,
    "Payment Successful",
    "Completed Payment"
  );

  return updated;
};

/**
 * Finalize a received payment if its grace period has elapsed (alias used by
 * controllers on every read so the backend is always the source of truth).
 */
const finalizeReceiptIfReady = async (payment) => {
  const now = new Date();
  if (payment.status !== "PaymentReceived") return payment;

  const receivedAt = payment.paymentReceivedAt
    ? new Date(payment.paymentReceivedAt)
    : null;
  if (!receivedAt) return payment;

  if (now.getTime() >= receivedAt.getTime() + RECEIPT_GRACE_MS()) {
    return finalizeReceipt(payment);
  }
  return payment;
};

/**
 * Sweep: finalize any PaymentReceived payments whose grace period elapsed,
 * even when the user never returns to the payment page.
 */
const finalizeReadyPayments = async () => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - RECEIPT_GRACE_MS());

  const received = await Payment.find({
    status: "PaymentReceived",
    paymentReceivedAt: { $lte: cutoff },
  });

  let finalized = 0;
  for (const payment of received) {
    const latest = await finalizeReceipt(payment);
    if (latest && latest.status === "Success") finalized += 1;
  }

  return finalized;
};
// ---------------------------------------------------------------------------
// Background sweeper
// ---------------------------------------------------------------------------

let sweeperHandle = null;

const runSweep = async () => {
  if (!isConnected()) return;

  try {
    await expireOverdueSessions();
    await finalizeReadyPayments();
    await processGatewayConfirmations();
  } catch (error) {
    console.error("Payment lifecycle sweep error:", error.message);
  }
};

const startLifecycleSweeper = () => {
  if (sweeperHandle) return sweeperHandle;

  runSweep(); // one pass shortly after boot (guarded by connection state)
  sweeperHandle = setInterval(runSweep, SWEEP_INTERVAL_MS());
  if (sweeperHandle.unref) sweeperHandle.unref();

  return sweeperHandle;
};

const stopLifecycleSweeper = () => {
  if (sweeperHandle) {
    clearInterval(sweeperHandle);
    sweeperHandle = null;
  }
};

module.exports = {
  PAYMENT_SESSION_MS,
  RECEIPT_GRACE_MS,
  GATEWAY_PROCESSING_MS,
  SWEEP_INTERVAL_MS,
  computeReceiptNumber,
  buildSessionPayload,
  expirePayment,
  expirePaymentIfNeeded,
  expireOverdueSessions,
  initiatePayment,
  confirmGatewayReceipt,
  failPayment,
  processGatewayConfirmations,
  finalizeReceipt,
  finalizeReceiptIfReady,
  finalizeReadyPayments,
  startLifecycleSweeper,
  stopLifecycleSweeper,
};

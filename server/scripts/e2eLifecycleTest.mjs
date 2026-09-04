/**
 * TEMPORARY comprehensive E2E test for the payment lifecycle state machine.
 *
 * Uses the lifecycle service directly with fast-tuned timing env vars so all
 * 10 required scenarios can be verified quickly and deterministically. All
 * created records are cleaned up at the end.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

// Fast, deterministic timing for the tests.
process.env.PAYMENT_SESSION_MS = "5000"; // 5s (stands in for 5 minutes)
process.env.RECEIPT_GRACE_MS = "1000"; // 1s (stands in for 1 minute)
process.env.GATEWAY_PROCESSING_MS = "800"; // middleman turnaround
process.env.PAYMENT_SWEEP_INTERVAL_MS = "2000";

// ESM -> CJS interop for the CommonJS lifecycle service.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Payment = require("../models/Payment");
const ExamRegistration = require("../models/ExamRegistration");
const Student = require("../models/Student");
const lifecycle = require("../services/paymentLifecycle");
const {
  generatePaymentNumber,
  generateTransactionId,
} = require("../utils/generateTransactionId");

const results = [];
const logResult = (step, ok, data) => {
  results.push({ step, ok });
  console.log(`\n[${ok ? "PASS" : "FAIL"}] ${step}`);
  if (data !== undefined) {
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let testStudent = null;
let registration = null;
let createdPaymentIds = [];

const makeRegistration = async () => {
  const student = await Student.create({
    name: "Cline Lifecycle Test",
    email: `cline.lifecycle.${Date.now()}@example.com`,
    password: "Test@1234",
    isEmailVerified: true,
  });
  const reg = await ExamRegistration.create({
    studentId: student._id,
    registrationNumber: `EX${Date.now()}`,
    examType: "JEE Main",
    registrationFee: 600,
    status: "Pending Payment",
  });
  return { student, reg };
};

const makePayment = async (studentId, registrationId, overrides = {}) => {
  const now = new Date();
  const payment = await Payment.create({
    paymentNumber: await generatePaymentNumber(),
    studentId,
    registrationId,
    amount: 600,
    paymentMethod: "UPI",
    transactionId: generateTransactionId(),
    status: "Pending",
    expiresAt: new Date(now.getTime() + lifecycle.PAYMENT_SESSION_MS()),
    ...overrides,
  });
  createdPaymentIds.push(payment._id);
  return payment;
};

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------
const createdStudents = [];
const createdRegistrations = [];

const newRegistration = async () => {
  const created = await makeRegistration();
  createdStudents.push(created.student._id);
  createdRegistrations.push(created.reg._id);
  return created;
};

const assert = (cond, msg) => {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
};

const runTest = async (name, fn) => {
  try {
    await fn();
    logResult(name, true);
  } catch (err) {
    logResult(name, false, err && err.stack ? err.stack : String(err));
  }
};

// ---------------------------------------------------------------------------
// Test 1 — Normal payment: Pay → middleman receives → grace → receipt
// ---------------------------------------------------------------------------
await runTest(
  "Test 1: Normal payment → PaymentInitiated → PaymentReceived → grace → Success + ONE receipt",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    // User clicks Pay on the passcode page → backend marks the attempt only.
    const initiated = await lifecycle.initiatePayment(payment);
    assert(initiated.ok === true, `initiate should succeed, got ${initiated.code}`);
    assert(
      initiated.payment.status === "PaymentInitiated",
      "clicking Pay must NOT mark the payment received"
    );
    assert(!!initiated.payment.paymentInitiatedAt, "paymentInitiatedAt recorded");
    payment = initiated.payment;

    // Middleman receives the funds (server-side sweep, user still connected).
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "PaymentReceived", `expected PaymentReceived, got ${payment.status}`);
    assert(!!payment.paymentReceivedAt, "paymentReceivedAt set by backend");

    // Grace period: receipt must NOT exist yet.
    assert(!payment.receiptNumber, "no receipt during the 1-minute grace period");

    // Grace elapses → receipt generated through the existing downstream flow.
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);
    payment = await lifecycle.finalizeReceiptIfReady(payment);
    assert(payment.status === "Success", `expected Success, got ${payment.status}`);
    assert(!!payment.receiptNumber, "receiptNumber generated");
    assert(!!payment.receiptGeneratedAt, "receiptGeneratedAt set");
    assert(!!payment.paidAt, "paidAt set");

    // Existing downstream step: registration becomes Registered.
    const updatedReg = await ExamRegistration.findById(reg._id);
    assert(updatedReg.status === "Registered", "registration marked Registered");
    assert(
      String(updatedReg.paymentId) === String(payment._id),
      "registration linked to the same payment"
    );

    // Idempotency: re-finalizing must not duplicate or alter the receipt.
    const receiptNumber = payment.receiptNumber;
    const firstTs = payment.receiptGeneratedAt.getTime();
    const again = await lifecycle.finalizeReceipt(payment);
    assert(again.status === "Success", "still Success on repeat finalize");
    assert(again.receiptNumber === receiptNumber, "same receipt number");
    assert(again.receiptGeneratedAt.getTime() === firstTs, "receiptGeneratedAt unchanged");
  }
);

// ---------------------------------------------------------------------------
// Test 2 — Session expiry: unpaid payment is auto-cancelled, record preserved
// ---------------------------------------------------------------------------
await runTest(
  "Test 2: Session expires without payment → Expired via read-path AND sweep, record preserved",
  async () => {
    const { student, reg } = await newRegistration();

    // (a) Lazy expiry — what GET /:id performs on every read.
    let payment = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 800),
    });
    const before = lifecycle.buildSessionPayload(payment);
    assert(before.status === "Pending" && before.timeRemainingMs > 0, "pending with time remaining");

    await sleep(1100);
    payment = await lifecycle.expirePaymentIfNeeded(await Payment.findById(payment._id));
    assert(payment.status === "Expired", `expected Expired, got ${payment.status}`);
    assert(!!payment.expiredAt, "expiredAt recorded");

    const payload = lifecycle.buildSessionPayload(payment);
    assert(payload.status === "Expired" && payload.timeRemainingMs === 0, "payload shows Expired");

    // (b) Background sweeper path — no user request at all.
    const sweepTarget = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 800),
    });
    await sleep(1100);
    const expiredCount = await lifecycle.expireOverdueSessions();
    assert(expiredCount >= 1, `sweep expired >=1 session, got ${expiredCount}`);
    const swept = await Payment.findById(sweepTarget._id);
    assert(swept.status === "Expired", "sweeper marked the session Expired");

    // Records are preserved for auditing/history — nothing deleted.
    const preserved = await Payment.find({
      _id: { $in: [payment._id, sweepTarget._id] },
    });
    assert(preserved.length === 2, "both expired records still exist in DB");
  }
);

// ---------------------------------------------------------------------------
// Test 3 — Pay clicked but payment NOT received (network failure) → Failed
// ---------------------------------------------------------------------------
await runTest(
  "Test 3: Pay clicked, network failure, funds never reach middleman → Failed (traceable, registration untouched)",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    const initiated = await lifecycle.initiatePayment(payment, {
      simulation: "network-failure",
    });
    assert(initiated.ok === true, `initiate ok, got ${initiated.code}`);
    assert(
      initiated.payment.status === "PaymentInitiated",
      "Pay click only initiates — never marks received"
    );
    payment = initiated.payment;

    // Gateway sweep reports the funds never arrived.
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "Failed", `expected Failed, got ${payment.status}`);
    assert(!!payment.failedAt, "failedAt recorded");

    // Backend still reports a definitive (non-success) status on refresh.
    const payload = lifecycle.buildSessionPayload(payment);
    assert(payload.status === "Failed", "session payload exposes Failed");

    // Transaction remains traceable and success was never faked.
    const traceable = await Payment.findById(payment._id);
    assert(!!traceable, "failed transaction preserved in DB");
    const r = await ExamRegistration.findById(reg._id);
    assert(r.status !== "Registered", "registration NOT marked Registered");
  }
);

// ---------------------------------------------------------------------------
// Test 4 — Money deducted but middleman never receives → session expires,
//          and an expired transaction can never be resurrected
// ---------------------------------------------------------------------------
await runTest(
  "Test 4: Initiated but unconfirmed → expires; late confirm/sweep/Pay all rejected",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 900),
    });

    const initiated = await lifecycle.initiatePayment(payment);
    assert(initiated.ok === true, "initiate ok");
    payment = initiated.payment;

    // No confirmation ever arrives; the session deadline passes.
    await sleep(1100);
    const expiredCount = await lifecycle.expireOverdueSessions();
    assert(expiredCount >= 1, "sweeper expired the overdue initiated session");
    payment = await Payment.findById(payment._id);
    assert(payment.status === "Expired", `expected Expired, got ${payment.status}`);

    // A late middleman confirmation must NOT resurrect it.
    const lateConfirm = await lifecycle.confirmGatewayReceipt(payment, new Date());
    assert(!lateConfirm, "late confirmation rejected for an expired payment");

    // The gateway sweep must not resurrect it either.
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "Expired", "still Expired after gateway sweep");

    // A new Pay click on the dead session is refused.
    const retry = await lifecycle.initiatePayment(payment);
    assert(retry.ok === false && retry.code === "EXPIRED", `re-initiate refused (${retry.code})`);
    assert(
      (await Payment.countDocuments({ transactionId: payment.transactionId })) === 1,
      "exactly one transaction record"
    );
  }
);

// ---------------------------------------------------------------------------
// Test 5 — Payment received, user closed the tab → backend finalizes anyway
// ---------------------------------------------------------------------------
await runTest(
  "Test 5: PaymentReceived while user disconnected → backend sweeper finalizes receipt after grace",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    const initiated = await lifecycle.initiatePayment(payment);
    assert(initiated.ok === true, "initiate ok");

    // Middleman receives funds server-side — user's browser is irrelevant.
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "PaymentReceived", "PAYMENT_RECEIVED persisted in DB");
    assert(!!payment.paymentReceivedAt, "paymentReceivedAt persisted");

    // User never returns. After the grace period the sweeper finalizes.
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);
    const finalizedCount = await lifecycle.finalizeReadyPayments();
    assert(finalizedCount >= 1, `sweeper finalized >=1, got ${finalizedCount}`);

    payment = await Payment.findById(payment._id);
    assert(payment.status === "Success", "Success without the user returning");
    assert(!!payment.receiptNumber, "receipt generated by the backend alone");

    // Existing downstream step still ran.
    const r = await ExamRegistration.findById(reg._id);
    assert(r.status === "Registered", "registration Registered by the sweeper path");
  }
);

// ---------------------------------------------------------------------------
// Test 6 — User returns within the 1-minute grace period
// ---------------------------------------------------------------------------
await runTest(
  "Test 6: Return within grace → PaymentReceived shown, receipt pending, then finalized exactly once",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    const initiated = await lifecycle.initiatePayment(payment);
    payment = initiated.payment;
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "PaymentReceived", "PaymentReceived");

    // User re-opens the same link mid-grace (what GET /:id does).
    const early = await lifecycle.finalizeReceiptIfReady(payment);
    assert(early.status === "PaymentReceived", "still PaymentReceived during grace");
    assert(!early.receiptNumber, "no receipt generated during grace");

    const payload = lifecycle.buildSessionPayload(early);
    assert(payload.status === "PaymentReceived", "payload shows Payment Received");
    assert(
      payload.receiptGraceRemainingMs > 0,
      `grace remaining surfaced (${payload.receiptGraceRemainingMs}ms)`
    );

    // Grace elapses; the same link now finalizes exactly once.
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);
    const visit1 = await lifecycle.finalizeReceiptIfReady(await Payment.findById(payment._id));
    assert(visit1.status === "Success" && !!visit1.receiptNumber, "finalized after grace");

    // Returning again produces the same single receipt — never a duplicate.
    const visit2 = await lifecycle.finalizeReceiptIfReady(await Payment.findById(payment._id));
    assert(visit2.receiptNumber === visit1.receiptNumber, "same receipt on repeat visits");
  }
);

// ---------------------------------------------------------------------------
// Test 7 — Page refresh / reopening the same link
// ---------------------------------------------------------------------------
await runTest(
  "Test 7: Refresh → latest DB status served, timer anchored on server clock",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 2000),
    });

    // Two "refreshes": remaining time must come from DB + server clock.
    const refresh1 = lifecycle.buildSessionPayload(payment);
    assert(refresh1.status === "Pending", "pending on first load");
    assert(
      Math.abs(refresh1.timeRemainingMs - 2000) < 500,
      `remaining anchored to expiresAt (${refresh1.timeRemainingMs}ms)`
    );

    await sleep(400);
    const refresh2 = lifecycle.buildSessionPayload(await Payment.findById(payment._id));
    assert(refresh2.status === "Pending", "consistent Pending after refresh");
    assert(
      refresh2.timeRemainingMs < refresh1.timeRemainingMs,
      `time decreased (${refresh1.timeRemainingMs} → ${refresh2.timeRemainingMs})`
    );

    // Session expires; another "refresh" must show Expired, not Pending.
    await sleep(1800);
    payment = await lifecycle.expirePaymentIfNeeded(await Payment.findById(payment._id));
    const refresh3 = lifecycle.buildSessionPayload(payment);
    assert(refresh3.status === "Expired" && refresh3.timeRemainingMs === 0, "expired after refresh");
    assert(refresh3.serverTime, "serverTime always provided");
  }
);

// ---------------------------------------------------------------------------
// Test 8 — Multiple Pay clicks
// ---------------------------------------------------------------------------
await runTest(
  "Test 8: Multiple Pay clicks → single initiation, post-receipt clicks refused, one transaction",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    const first = await lifecycle.initiatePayment(payment);
    assert(first.ok === true, "first Pay click initiates");

    // Double-click while the first attempt is in flight.
    const second = await lifecycle.initiatePayment(payment);
    assert(second.ok === false, "duplicate Pay click rejected");
    assert(["CONFLICT", "ALREADY_FINAL"].includes(second.code), `code=${second.code}`);

    // Gateway confirms, then yet another Pay click must be refused.
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "PaymentReceived", "PaymentReceived");
    const third = await lifecycle.initiatePayment(payment);
    assert(
      third.ok === false && third.code === "ALREADY_FINAL",
      `Pay after receipt refused (${third.code})`
    );

    // Finalize after grace — still exactly one transaction, one receipt.
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);
    payment = await lifecycle.finalizeReceiptIfReady(payment);
    assert(payment.status === "Success", "Success");
    const dupes = await Payment.countDocuments({ transactionId: payment.transactionId });
    assert(dupes === 1, `exactly one payment document (${dupes})`);
  }
);

// ---------------------------------------------------------------------------
// Test 9 — Multiple tabs / concurrent requests
// ---------------------------------------------------------------------------
await runTest(
  "Test 9: Multiple tabs → concurrent Pay clicks: one winner; concurrent receipt finalization: ONE receipt",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id);

    // (a) Two tabs click Pay at the same instant — exactly one may initiate.
    const [tabA, tabB] = await Promise.all([
      lifecycle.initiatePayment(payment),
      lifecycle.initiatePayment(payment),
    ]);
    const initiateWinners = [tabA, tabB].filter((r) => r.ok);
    assert(initiateWinners.length === 1, `exactly one initiate winner (${initiateWinners.length})`);
    assert(
      initiateWinners[0].payment.status === "PaymentInitiated",
      "winner is PaymentInitiated"
    );

    // (b) Gateway confirms once; after grace, three tabs finalize concurrently.
    await sleep(lifecycle.GATEWAY_PROCESSING_MS() + 400);
    await lifecycle.processGatewayConfirmations();
    payment = await Payment.findById(payment._id);
    assert(payment.status === "PaymentReceived", "PaymentReceived");
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);

    const [f1, f2, f3] = await Promise.all([
      lifecycle.finalizeReceipt(payment),
      lifecycle.finalizeReceipt(payment),
      lifecycle.finalizeReceipt(payment),
    ]);
    const transitionWinners = [f1, f2, f3].filter(
      (p) => p && p.status === "Success" && p.receiptNumber
    );
    assert(
      transitionWinners.length === 1,
      `exactly one caller performed the finalize transition (${transitionWinners.length})`
    );

    // Authoritative DB state: Success with a single receipt.
    payment = await Payment.findById(payment._id);
    assert(payment.status === "Success", "DB shows Success");
    assert(!!payment.receiptNumber, "DB has one receiptNumber");

    // Repeat visit: same receipt, timestamp untouched.
    const firstTs = payment.receiptGeneratedAt.getTime();
    const repeat = await lifecycle.finalizeReceiptIfReady(await Payment.findById(payment._id));
    assert(repeat.receiptNumber === payment.receiptNumber, "same receipt on repeat");
    assert(repeat.receiptGeneratedAt.getTime() === firstTs, "receipt timestamp stable");
  }
);

// ---------------------------------------------------------------------------
// Test 10 — Expiry race conditions
// ---------------------------------------------------------------------------
await runTest(
  "Test 10a: Expiry race — confirmation arriving after the deadline loses to Expired",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 700),
    });
    const initiated = await lifecycle.initiatePayment(payment);
    assert(initiated.ok === true, "initiate ok");

    // Deadline passes, then expiry sweep and a "just arrived" confirmation
    // race each other.
    await sleep(900);
    const [expiredCount, confirmed] = await Promise.all([
      lifecycle.expireOverdueSessions(),
      lifecycle.confirmGatewayReceipt(initiated.payment, new Date()),
    ]);
    assert(expiredCount >= 1, "expiry won the race");
    assert(!confirmed, "late confirmation rejected");

    const finalDoc = await Payment.findById(payment._id);
    assert(finalDoc.status === "Expired", `final state Expired (got ${finalDoc.status})`);
    assert(!finalDoc.paymentReceivedAt, "no paymentReceivedAt ever written");
  }
);

await runTest(
  "Test 10b: Expiry race — confirmation within/at the window wins and survives later expiry sweeps",
  async () => {
    const { student, reg } = await newRegistration();
    let payment = await makePayment(student._id, reg._id, {
      expiresAt: new Date(Date.now() + 1500),
    });
    const initiated = await lifecycle.initiatePayment(payment);
    assert(initiated.ok === true, "initiate ok");

    // Middleman received the funds exactly AT the deadline boundary
    // (receivedAt === expiresAt is still a valid receipt).
    const boundaryReceivedAt = new Date(payment.expiresAt);
    const confirmed = await lifecycle.confirmGatewayReceipt(
      initiated.payment,
      boundaryReceivedAt
    );
    assert(!!confirmed, "boundary confirmation accepted");
    assert(confirmed.status === "PaymentReceived", "PaymentReceived at boundary");
    assert(
      confirmed.paymentReceivedAt.getTime() === boundaryReceivedAt.getTime(),
      "receivedAt recorded exactly"
    );

    // The original deadline passes — expiry must NOT overwrite the receipt.
    await sleep(1600);
    await lifecycle.expireOverdueSessions();
    payment = await Payment.findById(payment._id);
    assert(
      payment.status === "PaymentReceived",
      `received payment survives expiry sweep (got ${payment.status})`
    );

    // And it still finalizes normally after the grace period.
    await sleep(lifecycle.RECEIPT_GRACE_MS() + 400);
    payment = await lifecycle.finalizeReceiptIfReady(payment);
    assert(payment.status === "Success", "finalized to Success");
    assert(!!payment.receiptNumber, "receipt generated");
  }
);

// ---------------------------------------------------------------------------
// Cleanup + summary
// ---------------------------------------------------------------------------
const cleanup = async () => {
  console.log("\nCleaning up test records...");
  if (createdPaymentIds.length)
    await Payment.deleteMany({ _id: { $in: createdPaymentIds } });
  if (createdRegistrations.length)
    await ExamRegistration.deleteMany({ _id: { $in: createdRegistrations } });
  if (createdStudents.length)
    await Student.deleteMany({ _id: { $in: createdStudents } });
  console.log("Cleanup done.");
};

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB — running payment lifecycle E2E tests...\n");

  const failed = results.filter((r) => !r.ok);
  console.log("\n================= SUMMARY =================");
  console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  FAILED: ${f.step}`));
    process.exitCode = 1;
  }
} catch (err) {
  console.error("FATAL:", err);
  process.exitCode = 1;
} finally {
  await cleanup().catch((e) => console.error("Cleanup error:", e.message));
  await mongoose.disconnect();
}
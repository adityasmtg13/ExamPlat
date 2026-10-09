const jwt = require("jsonwebtoken");

const Payment = require("../models/Payment");
const ExamRegistration = require("../models/ExamRegistration");
const {
  generatePaymentNumber,
  generateTransactionId,
} = require("../utils/generateTransactionId");
const Student = require("../models/Student");
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");
const createAuditLog = require("../utils/createAuditLog");
const lifecycle = require("../services/paymentLifecycle");

/**
 * Signed, short-lived login token embedded in the payment QR URL.
 *
 * The QR acts as the "login details" delivered to the scanning device: the
 * token is bound to the payment and its owner, and it expires together with
 * the payment session. When scanned, the client exchanges it at
 * /api/auth/qr-login for a normal session token, signs the student in
 * automatically, and jumps straight to the UPI PIN step.
 */
const buildQrLoginToken = (payment, now = new Date()) => {
  const ttlSeconds = Math.max(
    60,
    Math.ceil((payment.expiresAt.getTime() - now.getTime()) / 1000)
  );

  return jwt.sign(
    {
      purpose: "qr-payment-login",
      studentId: payment.studentId.toString(),
      paymentId: payment._id.toString(),
    },
    process.env.JWT_SECRET,
    { expiresIn: ttlSeconds }
  );
};

/**
 * Serialize a payment for the createPayment response, augmented with the
 * QR login token needed to build the "scan to pay" QR code on the client.
 */
const withQrLoginToken = (payment) => {
  const data = payment.toObject ? payment.toObject() : { ...payment };
  data.qrLoginToken = buildQrLoginToken(payment);
  return data;
};

/**
 * Create a payment for a registration
 * POST /api/payment/create
 *
 * Starts the 5-minute payment session: `expiresAt` is stored on the payment
 * record (database = source of truth). A still-valid Pending payment is
 * reused (no duplicate records); expired ones are lazily expired first.
 */
const createPayment = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { registrationId, paymentMethod } = req.body;

    if (!registrationId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Registration ID and payment method are required.",
      });
    }

    const allowedMethods = ["UPI", "QR", "Card"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    const registration = await ExamRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    if (registration.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (registration.status === "Registered") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been completed.",
      });
    }

    const now = new Date();

    // Reuse only a still-valid pending session; lazily expire the old one.
    const existingPayment = await Payment.findOne({
      registrationId,
      status: "Pending",
    });

    if (existingPayment) {
      const active = await lifecycle.expirePaymentIfNeeded(existingPayment);

      if (active.status === "Pending") {
        return res.status(200).json({
          success: true,
          payment: withQrLoginToken(active),
          paymentSession: lifecycle.buildSessionPayload(active, now),
        });
      }
    }

    // If another tab already started an attempt, reuse that same session
    // instead of creating a duplicate payment record.
    const initiated = await Payment.findOne({
      registrationId,
      status: { $in: ["PaymentInitiated", "PaymentReceived"] },
    });

    if (initiated) {
      const refreshed = await lifecycle.expirePaymentIfNeeded(initiated);
      return res.status(200).json({
        success: true,
        payment: withQrLoginToken(refreshed),
        paymentSession: lifecycle.buildSessionPayload(refreshed, now),
      });
    }

    const expiresAt = new Date(now.getTime() + lifecycle.PAYMENT_SESSION_MS());

    const payment = await Payment.create({
      paymentNumber: await generatePaymentNumber(),
      studentId,
      registrationId,
      amount: registration.registrationFee,
      paymentMethod,
      transactionId: generateTransactionId(),
      status: "Pending",
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      payment: withQrLoginToken(payment),
      paymentSession: lifecycle.buildSessionPayload(payment, new Date()),
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating payment.",
    });
  }
};

/**
 * Initiate payment attempt (user clicked "Pay")
 * POST /api/payment/initiate
 *
 * Critical: this only records that the user clicked Pay. The payment is NOT
 * considered received — the (mock) middleman separately confirms receipt in
 * the backend before the payment can be finalized.
 */
const initiatePayment = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { paymentId, simulation } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required.",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (payment.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const result = await lifecycle.initiatePayment(payment, { simulation });

    switch (result.code) {
      case "EXPIRED":
        return res.status(400).json({
          success: false,
          message: "This payment session has expired.",
          code: "EXPIRED",
          payment: result.payment,
          paymentSession: lifecycle.buildSessionPayload(result.payment),
        });
      case "ALREADY_FINAL":
        return res.status(400).json({
          success: false,
          message: "This payment has already been resolved.",
          code: "ALREADY_FINAL",
          payment: result.payment,
          paymentSession: lifecycle.buildSessionPayload(result.payment),
        });
      case "CONFLICT":
        return res.status(409).json({
          success: false,
          message: "Payment is already being processed.",
          code: "CONFLICT",
          payment: result.payment,
          paymentSession: lifecycle.buildSessionPayload(result.payment),
        });
      default:
        return res.status(200).json({
          success: true,
          message: "Payment initiated.",
          payment: result.payment,
          paymentSession: lifecycle.buildSessionPayload(result.payment),
        });
    }
  } catch (error) {
    console.error("Initiate Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while initiating payment.",
    });
  }
};

/**
 * Complete payment (Mock Gateway) — legacy endpoint, kept for backward
 * compatibility with the older direct-pay flows.
 *
 * The new QR/UPI flow never calls this; it uses /initiate + the backend
 * lifecycle. A guard is added so an expired session cannot be completed.
 */
const completePayment = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required.",
      });
    }

    // Find payment
    let payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    // Verify owner
    if (payment.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Prevent completing an expired session.
    payment = await lifecycle.expirePaymentIfNeeded(payment);

    if (payment.status === "Expired") {
      return res.status(400).json({
        success: false,
        message: "This payment session has expired.",
      });
    }

    // Prevent duplicate payment
    if (payment.status === "Success") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed.",
      });
    }

    // Mark payment as successful
    payment.status = "Success";
    payment.paidAt = new Date();

    await payment.save();

    // Update registration
    const registration = await ExamRegistration.findByIdAndUpdate(
      payment.registrationId,
      {
        status: "Registered",
        paymentId: payment._id,
      },
      { new: true }
    );

    // Fetch student details
    const student = await Student.findById(studentId);

    // Send payment confirmation email
    try {
      await sendPaymentConfirmation({
        student,
        registration,
        payment,
      });
    } catch (err) {
      console.error("Email Error:", err);
    }

    await createAuditLog(
      studentId,
      "Payment Successful",
      "Completed Payment"
    );

    res.status(200).json({
      success: true,
      message: "Payment successful.",
      payment,
    });
  } catch (error) {
    console.error("Complete Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while completing payment.",
    });
  }
};

/**
 * Get payment history
 * GET /api/payment/history
 */
const getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.student.id;

    const payments = await Payment.find({ studentId })
      .populate("registrationId", "registrationNumber examType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Payment History Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching payment history.",
    });
  }
};

/**
 * Get payment by ID
 * GET /api/payment/:id
 *
 * Returns the live session state. The backend lazily enforces expiry and the
 * 20-second receipt grace period on every read, so refreshes / new tabs always
 * see the authoritative status from the database.
 */
const getPaymentById = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { id } = req.params;

    let payment = await Payment.findById(id).populate(
      "registrationId",
      "registrationNumber examType registrationFee"
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (payment.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Backend enforcement on every read.
    payment = await lifecycle.expirePaymentIfNeeded(payment);
    payment = await lifecycle.finalizeReceiptIfReady(payment);

    res.status(200).json({
      success: true,
      payment,
      paymentSession: lifecycle.buildSessionPayload(payment, new Date()),
    });
  } catch (error) {
    console.error("Get Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching payment.",
    });
  }
};

module.exports = {
  createPayment,
  initiatePayment,
  completePayment,
  getPaymentHistory,
  getPaymentById,
};

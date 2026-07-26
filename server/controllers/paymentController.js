const Payment = require("../models/Payment");
const ExamRegistration = require("../models/ExamRegistration");
const {
  generatePaymentNumber,
  generateTransactionId,
} = require("../utils/generateTransactionId");
const Student = require("../models/Student");
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");

/**
 * Create a payment for a registration
 * POST /api/payment/create
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

    const existingPayment = await Payment.findOne({
      registrationId,
      status: "Pending",
    });

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        payment: existingPayment,
      });
    }

    const payment = await Payment.create({
      paymentNumber: await generatePaymentNumber(),
      studentId,
      registrationId,
      amount: registration.registrationFee,
      paymentMethod,
      transactionId: generateTransactionId(),
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      payment,
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
 * Complete payment (Mock Gateway)
 * POST /api/payment/complete
 */
/**
 * Complete payment (Mock Gateway)
 * POST /api/payment/complete
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
    const payment = await Payment.findById(paymentId);

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
 */
const getPaymentById = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { id } = req.params;

    const payment = await Payment.findById(id).populate(
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

    res.status(200).json({
      success: true,
      payment,
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
  completePayment,
  getPaymentHistory,
  getPaymentById,
};
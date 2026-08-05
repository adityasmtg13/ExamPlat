const Payment = require("../models/Payment");
const ExamRegistration = require("../models/ExamRegistration");
const Student = require("../models/Student");
const { generateReceipt } = require("../utils/receiptGenerator");
const createAuditLog = require("../utils/createAuditLog");

/**
 * Generate and download payment receipt
 * GET /api/receipt/:paymentId
 */
const downloadReceipt = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { paymentId } = req.params;

    // Fetch payment
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    // Verify ownership
    if (payment.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Only successful payments can generate receipts
    if (payment.status !== "Success") {
      return res.status(400).json({
        success: false,
        message: "Receipt is available only for successful payments.",
      });
    }

    // Fetch registration
    const registration = await ExamRegistration.findById(
      payment.registrationId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // Fetch student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Generate receipt number
    const receiptNumber = `RCPT${new Date().getFullYear()}${payment.paymentNumber.slice(
      -5
    )}`;

    // Generate and send PDF
    await generateReceipt(
      {
        receiptNumber,
        student,
        registration,
        payment,
      },
      res
    );

    await createAuditLog(
      studentId,
      "Receipt Download",
      "Downloaded Payment Receipt"
    );
  } catch (error) {
    console.error("Receipt Generation Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while generating receipt.",
    });
  }
};

module.exports = {
  downloadReceipt,
};
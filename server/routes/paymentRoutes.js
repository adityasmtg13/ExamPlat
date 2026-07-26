const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPayment,
  completePayment,
  getPaymentHistory,
  getPaymentById,
} = require("../controllers/paymentController");

// Create a new payment
router.post("/create", authMiddleware, createPayment);

// Complete payment (Mock Payment Gateway)
router.post("/complete", authMiddleware, completePayment);

// Get logged-in student's payment history
router.get("/history", authMiddleware, getPaymentHistory);

// Get payment details by ID
router.get("/:id", authMiddleware, getPaymentById);

module.exports = router;
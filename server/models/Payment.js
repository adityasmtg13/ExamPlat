const mongoose = require("mongoose");

const PAYMENT_STATUSES = [
  "Pending",
  "PaymentInitiated",
  "PaymentReceived",
  "Success",
  "Failed",
  "Expired",
];

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamRegistration",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "QR", "Card"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending",
    },

    /**
     * Payment session lifecycle timestamps.
     *
     * The backend/database is the source of truth for these. The 5-minute
     * session timer is anchored on `expiresAt`, which is always set when the
     * payment is created and is compared against the server clock.
     */
    // When the payment session expires if the payment has not been received.
    expiresAt: {
      type: Date,
      default: null,
    },

    // When the user clicked "Pay" (payment attempt initiated).
    paymentInitiatedAt: {
      type: Date,
      default: null,
    },

    // When the middleman/payment backend actually received the funds.
    paymentReceivedAt: {
      type: Date,
      default: null,
    },

    // When the payment attempt was marked failed.
    failedAt: {
      type: Date,
      default: null,
    },

    // When the session expired without payment being received.
    expiredAt: {
      type: Date,
      default: null,
    },

    // Receipt idempotency: set exactly once (guarded transition) when the
    // receipt is generated after the grace period.
    receiptNumber: {
      type: String,
      trim: true,
      default: null,
    },
    receiptGeneratedAt: {
      type: Date,
      default: null,
    },

    // Test/demo-only hook that simulates a middleman failure (e.g. the money
    // never reaching the payment system). Never set by the regular UI.
    simulation: {
      type: String,
      enum: [null, "network-failure"],
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES;
const mongoose = require("mongoose");

const examRegistrationSchema = new mongoose.Schema(
  {
    // Student Reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Registration Number (EX202600001)
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Exam Selected
    examType: {
      type: String,
      enum: ["NEET", "JEE Main"],
      required: true,
    },

    // Registration Fee
    registrationFee: {
      type: Number,
      required: true,
    },

    // Registration Status
    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Registered",
        "Cancelled",
      ],
      default: "Pending Payment",
    },

    // Payment Reference (filled after successful payment)
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // Registration Date
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ExamRegistration",
  examRegistrationSchema
);
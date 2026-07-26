const mongoose = require("mongoose");

const mockAttemptSchema = new mongoose.Schema(
  {
    // Student Reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Registration Reference
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamRegistration",
      required: true,
    },

    // Exam Name
    examType: {
      type: String,
      enum: ["JEE Main", "NEET"],
      required: true,
    },

    // Attempt Number (1, 2, 3)
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },

    // Attempt Status
    status: {
      type: String,
      enum: [
        "In Progress",
        "Completed",
        "Abandoned",
      ],
      default: "In Progress",
    },

    // Marks Obtained
    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total Marks
    totalMarks: {
      type: Number,
      default: 0,
    },

    // Correct Answers
    correctAnswers: {
      type: Number,
      default: 0,
    },

    // Wrong Answers
    wrongAnswers: {
      type: Number,
      default: 0,
    },

    // Unanswered Questions
    unanswered: {
      type: Number,
      default: 0,
    },

    // Percentage
    percentage: {
      type: Number,
      default: 0,
    },

    // Time Taken (seconds)
    timeTaken: {
      type: Number,
      default: 0,
    },

    // Attempt Start Time
    startedAt: {
      type: Date,
      default: Date.now,
    },

    // Submission Time
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attempt numbers for the same registration
mockAttemptSchema.index(
  {
    registrationId: 1,
    attemptNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "MockAttempt",
  mockAttemptSchema
);
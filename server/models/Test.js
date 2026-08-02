const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    defaultStartAt: {
      type: Date,
      default: null,
    },
    defaultEndAt: {
      type: Date,
      default: null,
    },
    defaultAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Live", "Closed", "Archived"],
      default: "Draft",
      index: true,
    },
    candidateCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    resultsPublishedAt: {
      type: Date,
      default: null,
    },
    resultsPublishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    testType: {
      type: String,
      enum: ["mock"],
      default: "mock",
      index: true,
    },
    examCategory: {
      type: String,
      enum: ["JEE", "NEET"],
      required: true,
      index: true,
    },
    selectAllStudents: {
      type: Boolean,
      default: false,
    },
    allowedCandidates: {
      type: [String],
      default: [],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", testSchema);
const mongoose = require("mongoose");

const allowedCandidateSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },
    hallTicketNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups by hallTicketNo + testId
allowedCandidateSchema.index({ hallTicketNo: 1, testId: 1 });

module.exports = mongoose.model("AllowedCandidate", allowedCandidateSchema);
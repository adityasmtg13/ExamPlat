const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    examCategory: {
      type: String,
      enum: ["JEE", "NEET"],
      default: "",
      index: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: Number,
      default: null,
      min: 0,
    },
    correctOption: {
      type: Number,
      default: null,
      min: 0,
    },
    marks: {
      type: Number,
      default: 4,
    },
    negativeMarks: {
      type: Number,
      default: 1,
    },
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    topic: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index(
  { testId: 1, questionId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Question", questionSchema);
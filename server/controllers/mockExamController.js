const fs = require("fs");
const path = require("path");

const MockAttempt = require("../models/MockAttempt");

/**
 * GET /api/mock-exam/questions/:attemptId
 * Load questions for a mock attempt
 */
exports.getMockQuestions = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { attemptId } = req.params;

    // Verify attempt belongs to logged-in student
    const attempt = await MockAttempt.findOne({
      _id: attemptId,
      studentId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Mock attempt not found.",
      });
    }

    // Allow loading questions only while the attempt is active
    if (attempt.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "This mock attempt is no longer active.",
      });
    }

    let filePath;
    let duration;

    if (attempt.examType === "JEE Main") {
      filePath = path.join(__dirname, "../data/jeeQuestions.json");
      duration = 180;
    } else if (attempt.examType === "NEET") {
      filePath = path.join(__dirname, "../data/neetQuestions.json");
      duration = 200;
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported exam type.",
      });
    }

    const questions = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    const safeQuestions = questions.map(
      ({ correctAnswer, ...question }) => question
    );

    return res.status(200).json({
      success: true,

      attempt: {
        _id: attempt._id,
        examType: attempt.examType,
        attemptNumber: attempt.attemptNumber,
      },

      duration,

      totalQuestions: safeQuestions.length,

      questions: safeQuestions,
    });
  } catch (err) {
    console.error("Get Mock Questions Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/mock-exam/submit/:attemptId
 * Submit a mock exam and calculate the result
 */
exports.submitMockExam = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await MockAttempt.findOne({
      _id: attemptId,
      studentId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Mock attempt not found.",
      });
    }

    if (attempt.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "This mock attempt has already been submitted.",
      });
    }

    let filePath;

    if (attempt.examType === "JEE Main") {
      filePath = path.join(
        __dirname,
        "../data/jeeQuestions.json"
      );
    } else if (attempt.examType === "NEET") {
      filePath = path.join(
        __dirname,
        "../data/neetQuestions.json"
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported exam type.",
      });
    }

    const questions = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let score = 0;

    for (const question of questions) {
      const selected = answers?.[question.id];

      if (selected === undefined) {
        unanswered++;
      } else if (selected === question.correctAnswer) {
        correctAnswers++;
        score += question.marks;
      } else {
        wrongAnswers++;
        score -= question.negativeMarks;
      }
    }

    const totalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    const percentage = Number(
      ((score / totalMarks) * 100).toFixed(2)
    );

    const submittedAt = new Date();

    const timeTaken = Math.floor(
      (submittedAt - attempt.startedAt) / 1000
    );

    attempt.status = "Completed";
    attempt.score = score;
    attempt.totalMarks = totalMarks;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.unanswered = unanswered;
    attempt.percentage = percentage;
    attempt.submittedAt = submittedAt;
    attempt.timeTaken = timeTaken;

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: "Mock test submitted successfully.",

      result: {
        examType: attempt.examType,
        attemptNumber: attempt.attemptNumber,
        score,
        totalMarks,
        correctAnswers,
        wrongAnswers,
        unanswered,
        percentage,
        timeTaken,
      },
    });
  } catch (err) {
    console.error("Submit Mock Exam Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
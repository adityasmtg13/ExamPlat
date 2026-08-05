const mongoose = require("mongoose");

const MockAttempt = require("../models/MockAttempt");
const Question = require("../models/Question");
const Test = require("../models/Test");
const createAuditLog = require("../utils/createAuditLog");

const getQuestionField = (question, primaryField, fallbackField) => {
  if (question[primaryField] !== undefined && question[primaryField] !== null) {
    return question[primaryField];
  }

  return question[fallbackField];
};

const buildTestIdQuery = (attempt, test) => {
  const stringIds = new Set();
  const objectIds = [];

  const addValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    const asString = String(value);
    stringIds.add(asString);

    if (mongoose.Types.ObjectId.isValid(asString)) {
      objectIds.push(new mongoose.Types.ObjectId(asString));
    }
  };

  addValue(attempt?.testId);
  addValue(attempt?.testMongoId);
  addValue(test?.testId);
  addValue(test?._id);

  const orConditions = [];

  if (stringIds.size > 0) {
    orConditions.push({ testId: { $in: [...stringIds] } });
  }

  if (objectIds.length > 0) {
    orConditions.push({ testId: { $in: objectIds } });
  }

  return orConditions.length > 0 ? { $or: orConditions } : null;
};

const findQuestionsForTest = async (attempt, test) => {
  const testIdQuery = buildTestIdQuery(attempt, test);

  if (!testIdQuery) {
    return [];
  }

  return Question.find(testIdQuery)
    .sort({ createdAt: 1, questionId: 1 })
    .lean();
};

const getExamDuration = (attempt) => {
  const examType = attempt.examType;
  const examCategory = attempt.examCategory;

  if (examType === "JEE Main" || examType === "JEE" || examCategory === "JEE") {
    return 180;
  }

  if (examType === "NEET" || examCategory === "NEET") {
    return 200;
  }

  return null;
};

const getQuestionMarks = (question) => question.marks ?? 4;

const getQuestionNegativeMarks = (question) => question.negativeMarks ?? 1;

const isSupportedExamType = (attempt) => getExamDuration(attempt) !== null;

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

    const duration = getExamDuration(attempt);

    if (!isSupportedExamType(attempt)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported exam type.",
      });
    }

    const test = await Test.findOne({
      $or: [
        { testId: attempt.testId },
        { _id: attempt.testMongoId || attempt.testId },
      ],
    }).lean();

    const questions = await findQuestionsForTest(attempt, test);

    const safeQuestions = questions.map((question) => ({
      id: String(getQuestionField(question, "questionId", "_id")),
      question:
        getQuestionField(question, "questionText", "question") ||
        getQuestionField(question, "question", "questionText"),
      options: question.options || [],
      subject: question.subject || "",
      topic: question.topic || "",
      marks: getQuestionMarks(question),
      negativeMarks: getQuestionNegativeMarks(question),
      correctAnswer:
        question.correctOption ?? question.correctAnswer ?? null,
    }));

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

    if (!isSupportedExamType(attempt)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported exam type.",
      });
    }

    const test = await Test.findOne({
      $or: [
        { testId: attempt.testId },
        { _id: attempt.testMongoId || attempt.testId },
      ],
    }).lean();

    const questions = await findQuestionsForTest(attempt, test);

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let score = 0;

    for (const question of questions) {
      const questionId = String(
        getQuestionField(question, "questionId", "_id")
      );
      const selected = answers?.[questionId];
      const correctOption = question.correctOption ?? question.correctAnswer;
      const marks = getQuestionMarks(question);
      const negativeMarks = getQuestionNegativeMarks(question);

      if (selected === undefined) {
        unanswered++;
      } else if (selected === correctOption) {
        correctAnswers++;
        score += marks;
      } else {
        wrongAnswers++;
        score -= negativeMarks;
      }
    }

    // Ensure score never goes below 0 (schema has min: 0 validation)
    score = Math.max(0, score);

    const totalMarks = questions.reduce(
      (sum, question) => sum + getQuestionMarks(question),
      0
    );

    const percentage =
      totalMarks > 0
        ? Number(((score / totalMarks) * 100).toFixed(2))
        : 0;

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

    await createAuditLog(
      studentId,
      "Submitted Mock Test",
      `Submitted ${attempt.testTitle || "Mock Test"}`
    );

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
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMockQuestions,
  submitMockExam,
} = require("../controllers/mockExamController");

/**
 * GET /api/mock-exam/questions/:attemptId
 * Load questions for an active mock attempt
 */
router.get(
  "/questions/:attemptId",
  authMiddleware,
  getMockQuestions
);

/**
 * POST /api/mock-exam/submit/:attemptId
 * Submit a mock test and calculate the result
 */
router.post(
  "/submit/:attemptId",
  authMiddleware,
  submitMockExam
);

module.exports = router;
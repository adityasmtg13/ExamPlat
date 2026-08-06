const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMockTests,
  getMockTestById,
  getMockAttemptHistory,
  createMockAttempt,
  submitAndRestartMockAttempt,
  getMockResult,
  downloadMockResultPdf,
  sendResultEmail,
  getAnalytics,
} = require("../controllers/mockTestController");


/**
 * Get Available Mock Tests
 * GET /api/mock-tests
 */
router.get("/", authMiddleware, getMockTests);

/**
 * Get Single Mock Test
 * GET /api/mock-tests/detail/:testId
 */
router.get(
  "/detail/:testId",
  authMiddleware,
  getMockTestById
);

/**
 * Start Mock Test
 * POST /api/mock-tests/start/:testId
 */
router.post(
  "/start/:testId",
  authMiddleware,
  createMockAttempt
);

/**
 * Submit current attempt and start a new one
 * POST /api/mock-tests/submit-and-restart/:testId
 */
router.post(
  "/submit-and-restart/:testId",
  authMiddleware,
  submitAndRestartMockAttempt
);

/**
 * Get Mock Attempt History
 * GET /api/mock-tests/history/:testId
 */
router.get(
  "/history/:testId",
  authMiddleware,
  getMockAttemptHistory
);

/**
 * Get Mock Test Result
 * GET /api/mock-tests/result/:attemptId
 */
router.get(
  "/result/:attemptId",
  authMiddleware,
  getMockResult
);

/**
 * Download Mock Test Result PDF
 * GET /api/mock-tests/result/:attemptId/pdf
 */
router.get(
  "/result/:attemptId/pdf",
  authMiddleware,
  downloadMockResultPdf
);

/**
 * Send Mock Test Result to Email
 * POST /api/mock-tests/result/:attemptId/send-email
 */
router.post(
  "/result/:attemptId/send-email",
  authMiddleware,
  sendResultEmail
);

router.get(
  "/analytics",
  authMiddleware,
  getAnalytics
);

module.exports = router;
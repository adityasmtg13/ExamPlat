const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMockTests,
  getMockAttemptHistory,
  createMockAttempt,
  submitAndRestartMockAttempt,
  getMockResult,
  getAnalytics,
} = require("../controllers/mockTestController");


/**
 * Get Available Mock Tests
 * GET /api/mock-tests
 */
router.get("/", authMiddleware, getMockTests);

/**
 * Start Mock Test
 * POST /api/mock-tests/start/:registrationId
 */
router.post(
  "/start/:registrationId",
  authMiddleware,
  createMockAttempt
);

/**
 * Submit current attempt and start a new one
 * POST /api/mock-tests/submit-and-restart/:registrationId
 */
router.post(
  "/submit-and-restart/:registrationId",
  authMiddleware,
  submitAndRestartMockAttempt
);

/**
 * Get Mock Attempt History
 * GET /api/mock-tests/history/:registrationId
 */
router.get(
  "/history/:registrationId",
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

router.get(
  "/analytics",
  authMiddleware,
  getAnalytics
);

module.exports = router;
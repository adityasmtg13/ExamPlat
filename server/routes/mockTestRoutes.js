const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


const {
  getMockTests,
  getMockAttemptHistory,
  createMockAttempt,
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
 * Get Mock Attempt History
 * GET /api/mock-tests/history/:registrationId
 */
router.get(
  "/history/:registrationId",
  authMiddleware,
  getMockAttemptHistory
);

module.exports = router;
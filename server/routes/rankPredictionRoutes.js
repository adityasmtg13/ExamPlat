const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  predictRank,
  healthCheck,
} = require("../controllers/rankPredictionController");

/**
 * POST /api/predict-rank
 * Predict JEE rank from mock test marks
 */
router.post("/", authMiddleware, predictRank);

/**
 * GET /api/predict-rank/health
 * Check Python service health
 */
router.get("/health", healthCheck);

module.exports = router;
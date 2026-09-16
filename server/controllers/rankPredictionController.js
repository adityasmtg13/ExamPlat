const axios = require("axios");

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

/**
 * POST /api/predict-rank
 * Proxy request to Python Flask service for rank prediction
 */
exports.predictRank = async (req, res) => {
  try {
    const { averageMarks, examType } = req.body;

    if (averageMarks === undefined || averageMarks === null) {
      return res.status(400).json({
        success: false,
        message: "Average marks are required.",
      });
    }

    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/predict-rank`,
      {
        averageMarks,
        examType: examType || "JEE Main",
      },
      {
        timeout: 15000,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Rank Prediction Proxy Error:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(502).json({
      success: false,
      message:
        "Rank prediction service is unavailable. Please try again later.",
    });
  }
};

/**
 * GET /api/predict-rank/health
 * Check if Python service is healthy
 */
exports.healthCheck = async (req, res) => {
  try {
    const response = await axios.get(
      `${PYTHON_SERVICE_URL}/health`,
      {
        timeout: 5000,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Rank prediction service is unavailable.",
    });
  }
};
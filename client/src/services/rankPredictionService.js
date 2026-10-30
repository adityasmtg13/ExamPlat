import axios from "axios";

const RANK_PREDICTION_API = "http://localhost:5010/api/predict-rank";

const getToken = () => localStorage.getItem("token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Predict JEE 2026 rank from average mock test marks
 */
export const predictRank = async ({ averageMarks, examType }) => {
  try {
    const { data } = await axios.post(
      RANK_PREDICTION_API,
      {
        averageMarks,
        examType: examType || "JEE Main",
      },
      authConfig()
    );

    return data;
  } catch (error) {
    console.error("Predict Rank Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to predict rank.",
      }
    );
  }
};

/**
 * Check if rank prediction service is healthy
 */
export const checkRankPredictionHealth = async () => {
  try {
    const { data } = await axios.get(
      `${RANK_PREDICTION_API}/health`
    );

    return data;
  } catch (error) {
    return {
      success: false,
      message: "Rank prediction service is unavailable.",
    };
  }
};

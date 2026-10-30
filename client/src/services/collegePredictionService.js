import axios from "axios";

const COLLEGE_PREDICTION_API =
  "http://localhost:5010/api/predict-colleges";

const getToken = () => localStorage.getItem("token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const predictColleges = async (predictedRank) => {
  try {
    const { data } = await axios.post(
      COLLEGE_PREDICTION_API,
      {
        predictedRank,
      },
      authConfig()
    );

    return data;
  } catch (error) {
    console.error("College Prediction Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to predict colleges.",
      }
    );
  }
};
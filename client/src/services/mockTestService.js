import axios from "axios";

const MOCK_TEST_API = "http://localhost:5010/api/mock-tests";
const MOCK_EXAM_API = "http://localhost:5010/api/mock-exam";

/**
 * Get JWT Token
 */
const getToken = () => localStorage.getItem("token");

/**
 * Authorization Headers
 */
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Get Available Mock Tests
 */
export const getMockTests = async () => {
  try {
    const { data } = await axios.get(
      MOCK_TEST_API,
      authConfig()
    );

    return data;
  } catch (error) {
    console.error("Get Mock Tests Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch mock tests.",
      }
    );
  }
};

/**
 * Get Mock Attempt History
 */
export const getMockAttemptHistory = async (
  registrationId
) => {
  try {
    const { data } = await axios.get(
      `${MOCK_TEST_API}/history/${registrationId}`,
      authConfig()
    );

    return data;
  } catch (error) {
    console.error(
      "Get Mock Attempt History Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to fetch mock attempt history.",
      }
    );
  }
};

/**
 * Start Mock Attempt
 */
export const startMockAttempt = async (
  registrationId
) => {
  try {
    const { data } = await axios.post(
      `${MOCK_TEST_API}/start/${registrationId}`,
      {},
      authConfig()
    );

    console.log("Start Mock API Response:", data);

    return data;
  } catch (error) {
    console.error(
      "Start Mock Attempt Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to start mock examination.",
      }
    );
  }
};

/**
 * Load Questions
 */
export const getMockQuestions = async (
  attemptId
) => {
  try {
    const { data } = await axios.get(
      `${MOCK_EXAM_API}/questions/${attemptId}`,
      authConfig()
    );

    console.log("Questions Response:", data);

    return data;
  } catch (error) {
    console.error(
      "Get Mock Questions Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to load mock questions.",
      }
    );
  }
};

/**
 * Submit Mock Exam
 */
export const submitMockExam = async (
  attemptId,
  answers
) => {
  try {
    const { data } = await axios.post(
      `${MOCK_EXAM_API}/submit/${attemptId}`,
      { answers },
      authConfig()
    );

    console.log("Submit Response:", data);

    return data;
  } catch (error) {
    console.error(
      "Submit Mock Exam Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to submit mock examination.",
      }
    );
  }
};

export const submitAndRestartMockAttempt = async (
  registrationId
) => {
  try {
    const { data } = await axios.post(
      `${MOCK_TEST_API}/submit-and-restart/${registrationId}`,
      {},
      authConfig()
    );

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to restart mock test.",
      }
    );
  }
};

/**
 * Get Mock Test Result
 */
export const getMockResult = async (attemptId) => {
  try {
    const { data } = await axios.get(
      `${MOCK_TEST_API}/result/${attemptId}`,
      authConfig()
    );

    console.log("Mock Result Response:", data);

    return data;
  } catch (error) {
    console.error(
      "Get Mock Result Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch mock test result.",
      }
    );
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(
      `${MOCK_TEST_API}/analytics`,
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch analytics.",
      }
    );
  }
};
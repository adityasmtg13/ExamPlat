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
  testId
) => {
  try {
    const { data } = await axios.get(
      `${MOCK_TEST_API}/history/${testId}`,
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
  testId
) => {
  try {
    const { data } = await axios.post(
      `${MOCK_TEST_API}/start/${testId}`,
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
  testId
) => {
  try {
    const { data } = await axios.post(
      `${MOCK_TEST_API}/submit-and-restart/${testId}`,
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

export const getMockTestById = async (testId) => {
  try {
    const { data } = await axios.get(
      `${MOCK_TEST_API}/detail/${testId}`,
      authConfig()
    );

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch mock test details.",
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

/**
 * Download Mock Test Result PDF
 */
export const downloadMockResultPdf = async (attemptId) => {
  try {
    const response = await axios.get(
      `${MOCK_TEST_API}/result/${attemptId}/pdf`,
      {
        ...authConfig(),
        responseType: "blob",
      }
    );

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", `Mock_Result_${attemptId}.pdf`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Download Result PDF Error:", error);

    // If error response is a blob, try to parse the JSON message
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);

        throw {
          success: false,
          message: json.message || "Failed to download result PDF.",
        };
      } catch (parseError) {
        throw (
          parseError?.message
            ? parseError
            : {
                success: false,
                message: "Failed to download result PDF.",
              }
        );
      }
    }

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to download result PDF.",
      }
    );
  }
};

/**
 * Send Mock Test Result to Email
 */
export const sendMockResultEmail = async (attemptId) => {
  try {
    const response = await axios.post(
      `${MOCK_TEST_API}/result/${attemptId}/send-email`,
      {},
      authConfig()
    );

    return response.data;
  } catch (error) {
    console.error("Send Result Email Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to send result email.",
      }
    );
  }
};

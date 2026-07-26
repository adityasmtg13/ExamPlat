import axios from "axios";

const API = "http://localhost:5010/api/registration";

// Get JWT Token
const getToken = () => {
  return localStorage.getItem("token");
};

// Authorization Header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Create Exam Registration
 * POST /api/registration
 */
export const createRegistration = async (examType) => {
  const response = await axios.post(
    API,
    { examType },
    authHeader()
  );

  return response.data;
};

/**
 * Get Logged-in Student Registration History
 * GET /api/registration/history
 */
export const getRegistrationHistory = async () => {
  const response = await axios.get(
    `${API}/history`,
    authHeader()
  );

  return response.data;
};

/**
 * Get Single Registration
 * GET /api/registration/:id
 */
export const getRegistrationById = async (registrationId) => {
  const response = await axios.get(
    `${API}/${registrationId}`,
    authHeader()
  );

  return response.data;
};
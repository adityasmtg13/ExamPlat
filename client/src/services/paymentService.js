import axios from "axios";

const API = "http://localhost:5010/api/payment";

/**
 * Get JWT token from localStorage
 */
const getToken = () => localStorage.getItem("token");

/**
 * Authorization header
 */
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Create a payment
 * POST /api/payment/create
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API}/create`,
      paymentData,
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create payment.",
      }
    );
  }
};

/**
 * Complete payment (Mock Gateway)
 * POST /api/payment/complete
 */
export const completePayment = async (paymentId) => {
  try {
    const response = await axios.post(
      `${API}/complete`,
      { paymentId },
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to complete payment.",
      }
    );
  }
};

/**
 * Get payment history
 * GET /api/payment/history
 */
export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(
      `${API}/history`,
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch payment history.",
      }
    );
  }
};

/**
 * Get payment by ID
 * GET /api/payment/:id
 */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API}/${paymentId}`,
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch payment details.",
      }
    );
  }
};
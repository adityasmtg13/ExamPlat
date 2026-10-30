import axios from "axios";
import API_BASE_URL from "./api";

const API = `${API_BASE_URL}/payment`;

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
 * Initiate payment attempt (user clicked "Pay")
 * POST /api/payment/initiate
 *
 * This only marks the attempt as initiated — it does NOT confirm the payment.
 * Confirmation happens server-side when the (mock) middleman receives funds.
 */
export const initiatePayment = async (paymentId, simulation) => {
  try {
    const response = await axios.post(
      `${API}/initiate`,
      { paymentId, simulation },
      authConfig()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to initiate payment.",
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

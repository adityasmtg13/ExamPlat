import axios from "axios";

const API = "https://examplat-backend.onrender.com/api/auth";

const getToken = () => localStorage.getItem("token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const registerStudent = (data) => {
  return axios.post(`${API}/register`, data);
};

export const verifyOtp = (data) => {
  return axios.post(`${API}/verify-otp`, data);
};

export const resendOtp = (data) => {
  return axios.post(`${API}/resend-otp`, data);
};

export const forgotPassword = (data) => {
  return axios.post(`${API}/forgot-password`, data);
};

export const resetPassword = (data) => {
  return axios.post(`${API}/reset-password`, data);
};

export const loginStudent = (data) => {
  return axios.post(`${API}/login`, data);
};

/**
 * QR-scan auto-login
 * POST /api/auth/qr-login
 *
 * Exchanges the short-lived token embedded in the payment QR for a normal
 * session token + student profile, so the scanning device is signed in
 * automatically and jumps straight to the UPI PIN step.
 */
export const qrLogin = (data) => {
  return axios.post(`${API}/qr-login`, data);
};

export const logoutStudent = () => {
  return axios.post(`${API}/logout`, {}, authConfig());
};

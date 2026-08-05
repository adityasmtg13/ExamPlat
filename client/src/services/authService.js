import axios from "axios";

const API = "http://localhost:5010/api/auth";

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

export const logoutStudent = () => {
  return axios.post(`${API}/logout`, {}, authConfig());
};

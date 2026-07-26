import axios from "axios";

const API = "http://localhost:5010/api/auth";

export const registerStudent = (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginStudent = (data) => {
  return axios.post(`${API}/login`, data);
};
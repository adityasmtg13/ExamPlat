import axios from "axios";
import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/final-results`;

export const getFinalResults = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

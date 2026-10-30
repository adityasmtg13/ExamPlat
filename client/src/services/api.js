const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5010/api").replace(/\/$/, "");

export default API_BASE_URL;

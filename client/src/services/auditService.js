import axios from "axios";

const API = "http://localhost:5010/api/audit";

/**
 * Get JWT token from localStorage
 */
const getToken = () => localStorage.getItem("token");

/**
 * Authorization headers
 */
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/**
 * Get audit logs for the logged-in student
 * GET /api/audit
 */
export const getAuditLogs = async () => {
  try {
    const response = await axios.get(API, authConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch audit logs.",
      }
    );
  }
};

/**
 * Create a custom audit log entry
 * POST /api/audit/log
 */
export const logAuditEvent = async (action, description) => {
  try {
    const response = await axios.post(
      `${API}/log`,
      { action, description },
      authConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Audit Log Creation Error:", error);
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create audit log.",
      }
    );
  }
};

/**
 * Reusable helper to log a page view / activity
 * @param {String} action - The action name (e.g. "Viewed Dashboard")
 * @param {String} description - Optional description (defaults to action)
 */
export const logActivity = async (action, description = action) => {
  try {
    await logAuditEvent(action, description);
  } catch (error) {
    // Silently fail - audit logging should never break the page
    console.error("Audit Log Error:", error);
  }
};

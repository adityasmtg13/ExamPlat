import axios from "axios";

const API = "http://localhost:5010/api/receipt";

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
  responseType: "blob", // Required for downloading PDF
});

/**
 * Download receipt PDF
 * GET /api/receipt/:paymentId
 */
export const downloadReceipt = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API}/${paymentId}`,
      authConfig()
    );

    // Create a downloadable PDF
    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `Receipt-${paymentId}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Receipt Download Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to download receipt.",
      }
    );
  }
};
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAuditLogs, createCustomAuditLog } = require("../controllers/auditController");

// Get audit logs for the logged-in student
router.get("/", authMiddleware, getAuditLogs);

// Create a custom audit log entry
router.post("/log", authMiddleware, createCustomAuditLog);

module.exports = router;

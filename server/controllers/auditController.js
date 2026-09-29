const AuditLog = require("../models/AuditLog");
const createAuditLog = require("../utils/createAuditLog");

/**
 * Get audit logs for the currently logged-in student
 * GET /api/audit
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const studentId = req.student.id;

    // Data retention: only keep & return the past 1 week of activity
    const RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    const cutoff = new Date(Date.now() - RETENTION_MS);

    // Delete any audit logs older than the retention window
    await AuditLog.deleteMany({
      studentId,
      createdAt: { $lt: cutoff },
    });

    // Only fetch logs from the past 7 days
    const logs = await AuditLog.find({
      studentId,
      createdAt: { $gte: cutoff },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (err) {
    console.error("Get Audit Logs Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Create a custom audit log entry
 * POST /api/audit/log
 */
exports.createCustomAuditLog = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { action, description } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        message: "Action and description are required.",
      });
    }

    await createAuditLog(studentId, action, description);

    res.status(201).json({
      success: true,
      message: "Audit log created successfully.",
    });
  } catch (err) {
    console.error("Create Audit Log Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

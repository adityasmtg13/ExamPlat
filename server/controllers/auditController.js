const AuditLog = require("../models/AuditLog");
const createAuditLog = require("../utils/createAuditLog");

/**
 * Get audit logs for the currently logged-in student
 * GET /api/audit
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const studentId = req.student.id;

    const logs = await AuditLog.find({ studentId })
      .sort({ createdAt: -1 });

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

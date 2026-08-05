const AuditLog = require("../models/AuditLog");

/**
 * Create an audit log entry
 * @param {String} studentId - The student's ObjectId
 * @param {String} action - The action performed
 * @param {String} description - Description of the action
 * @param {String} status - Status of the action (defaults to "Success")
 */
const createAuditLog = async (studentId, action, description, status = "Success") => {
  try {
    await AuditLog.create({
      studentId,
      action,
      description,
      status,
    });
  } catch (error) {
    console.error("Audit Log Creation Error:", error);
  }
};

module.exports = createAuditLog;
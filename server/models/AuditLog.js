const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Success",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete audit logs older than 7 days (data retention)
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
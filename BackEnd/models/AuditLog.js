import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g., "USER_STATUS_CHANGE", "BROADCAST_CREATED", "JOB_DELETED"
    },
    details: {
      type: String,
      required: true, // Description text about what exactly happened
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Kis admin ne yeh kaam kiya
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Broadcast message content is required"],
      trim: true,
    },
    targetGroup: {
      type: String,
      enum: ["all", "recruiter", "applicant"],
      default: "all",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin user ki ID reference
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Broadcast", broadcastSchema);
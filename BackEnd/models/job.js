import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }], // e.g., ["React", "Node.js", "Python"]
    experienceLevel: { type: String },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    
    // Links the job to the Recruiter who posted it
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
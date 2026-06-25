import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }], // e.g., ["React", "Node.js", "Python"]
    experienceLevel: { type: String, default: "Entry Level" },
    location: { type: String, default: "Remote" },
    salary: { type: String, default: "Not specified" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    
    // Links the job to the Recruiter who posted it
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Company/Team info
    company: { type: String, default: "" },
    department: { type: String, default: "" },
    
    // Job details
    jobType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Temporary"], default: "Full-time" },
    
    // Application tracking
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
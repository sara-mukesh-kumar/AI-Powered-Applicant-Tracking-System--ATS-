import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // File Storage
    resumeUrl: { type: String, required: true }, // The resume URL
    
    // Kanban Pipeline Status
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offered", "Rejected", "Withdrawn"],
      default: "Applied",
    },

    // AI Integration & Resume Parsing
    aiScore: { type: Number }, // Match score 1-100
    aiSummary: { type: String }, // Why they are a good fit
    extractedSkills: [{ type: String }], // Skills found in the resume

    // Recruiter notes and interactions
    notes: { type: String, default: "" },
    interviewDate: { type: Date },
    interviewNotes: { type: String },
    
    // Rating by recruiter
    recruiterRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Ensure an applicant can only apply to the same job once
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
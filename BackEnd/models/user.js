import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["applicant", "recruiter", "admin"],
      default: "applicant",
    },
    status: {                          
    type: String,
    enum: ["active", "pending", "suspended"],
    default: "active"
  },
    // Optional profile info for applicants
    skills: [{ type: String }],
    resumeUrl: { type: String }, // General profile resume
    designation: { type: String, default: "Applicant" },
    location: { type: String, default: "" },
    summary: { type: String, default: "" },
    experience: [{
      company: { type: String },
      title: { type: String },
      duration: { type: String },
      description: { type: String }
    }],
    education: [{
      degree: { type: String },
      school: { type: String },
      duration: { type: String }
    }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    privacy: {
      openToWork: { type: Boolean, default: true },
      visibility: { type: String, enum: ["public", "verified", "private"], default: "public" },
      blockedCompanies: [{ type: String }]
    },
    alerts: [{
      keywords: { type: String },
      location: { type: String },
      frequency: { type: String }
    }],
    documents: [{
      name: { type: String },
      url: { type: String },
      category: { type: String, enum: ["resume", "cover_letter", "portfolio", "id"], default: "resume" }
    }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
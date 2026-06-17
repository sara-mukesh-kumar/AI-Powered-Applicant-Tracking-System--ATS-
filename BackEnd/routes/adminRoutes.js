import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; // Application model imported successfully
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sab routes admin only hain
router.use(protect, authorize("admin"));

// 📊 GET /api/admin/stats — Dashboard Analytics System Overview
router.get("/stats", async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalApplicants = await User.countDocuments({ role: "applicant" });
    const totalApplications = await Application.countDocuments(); // Real active application counter

    res.json({
      totalJobs,
      totalApplications, 
      totalRecruiters,
      totalApplicants,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 👥 GET /api/admin/users — Sab users fetch karne ke liye
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔧 PATCH /api/admin/users/:id/status — User system-access controller
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑️ DELETE /api/admin/users/:id — Permanent user ban
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 💼 GET /api/admin/jobs — Sab posted positions ki monitor list
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛡️ PATCH /api/admin/jobs/:id/status — Job audit moderations
router.patch("/jobs/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑️ DELETE /api/admin/jobs/:id — Spammers jobs cleanup endpoint
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🤖 GET /api/admin/applications — Week 3 AI and Pipeline Query Metrics
router.get("/applications", async (req, res) => {
  try {
    const { score, status } = req.query;
    let queryCondition = {};

    // 1. Pipeline status checking validation filter
    if (status && status !== "all") {
      queryCondition.status = status;
    }

    // 2. Week 3 AI score-based mathematical matching filter
    if (score && score !== "all") {
      if (score === "high") {
        queryCondition["aiAnalysis.aiScore"] = { $gte: 80 };
      } else if (score === "medium") {
        queryCondition["aiAnalysis.aiScore"] = { $gte: 60, $lt: 80 };
      } else if (score === "low") {
        queryCondition["aiAnalysis.aiScore"] = { $lt: 60 };
      }
    }

    const applications = await Application.find(queryCondition)
      .populate("jobId", "title company location") 
      .populate("applicantId", "name email")       
      .sort({ createdAt: -1 });                    

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑️ DELETE /api/admin/applications/:id — Purge submission entry log
router.delete("/applications/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
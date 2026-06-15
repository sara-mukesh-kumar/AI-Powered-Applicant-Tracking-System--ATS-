import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; // 1. Application model import kiya
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sab routes admin only hain
router.use(protect, authorize("admin"));

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalApplicants = await User.countDocuments({ role: "applicant" });
    const totalApplications = await Application.countDocuments(); // 2. Real application count kiya

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

// GET /api/admin/users — sab users
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

// PATCH /api/admin/users/:id/status — status change
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

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/jobs — sab jobs
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

// PATCH /api/admin/jobs/:id/status
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

// DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. NEW: GET /api/admin/applications — Get all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company location") 
      .populate("applicantId", "name email")       
      .sort({ createdAt: -1 });                    

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 4. NEW: DELETE /api/admin/applications/:id — Delete an application
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
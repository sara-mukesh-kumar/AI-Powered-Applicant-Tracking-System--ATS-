import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; 
import Broadcast from "../models/Broadcast.js"; // 1. Broadcast model ko import kiya
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
    const totalApplications = await Application.countDocuments(); 

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

    if (status && status !== "all") {
      queryCondition.status = status;
    }

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


// ========================================================
// 📢 --- NEW: WEEK 4 ADVANCED BROADCAST ENDPOINTS ---
// ========================================================

// ⚡ POST /api/admin/broadcast — Push a new system announcement banner
router.post("/broadcast", async (req, res) => {
  try {
    const { message, targetGroup } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Broadcast message is required" });
    }

    const newBroadcast = new Broadcast({
      message,
      targetGroup: targetGroup || "all",
      senderId: req.user._id, // protect middleware se logged-in admin ki id extract ho jayegi
    });

    await newBroadcast.save();
    res.status(201).json({ success: true, broadcast: newBroadcast });
  } catch (error) {
    res.status(500).json({ message: "Server error while creating broadcast", error: error.message });
  }
});

// ⚡ GET /api/admin/broadcasts — Pull full announcements history log
router.get("/broadcasts", async (req, res) => {
  try {
    const broadcasts = await Broadcast.find()
      .populate("senderId", "name email")
      .sort({ createdAt: -1 }); // Nayi warnings sabse upar dikhengi
    res.json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching history", error: error.message });
  }
});

// ⚡ DELETE /api/admin/broadcast/:id — Purge expired/old warning notification
router.delete("/broadcast/:id", async (req, res) => {
  try {
    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) return res.status(404).json({ message: "Broadcast warning log not found" });
    res.json({ message: "Broadcast deleted successfully from server logs" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting broadcast", error: error.message });
  }
});

export default router;
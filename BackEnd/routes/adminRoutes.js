import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; 
import Broadcast from "../models/Broadcast.js"; 
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📊 GET /api/admin/stats — Dashboard Analytics System Overview (Admin Only)
router.get("/stats", protect, authorize("admin"), async (req, res) => {
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

// 👥 GET /api/admin/users — Sab users fetch karne ke liye (Admin Only)
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔧 PATCH /api/admin/users/:id/status (Admin Only)
router.patch("/users/:id/status", protect, authorize("admin"), async (req, res) => {
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

// 🗑️ DELETE /api/admin/users/:id (Admin Only)
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 💼 GET /api/admin/jobs (Admin Only)
router.get("/jobs", protect, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛡️ PATCH /api/admin/jobs/:id/status (Admin Only)
router.patch("/jobs/:id/status", protect, authorize("admin"), async (req, res) => {
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

// 🗑️ DELETE /api/admin/jobs/:id (Admin Only)
router.delete("/jobs/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🤖 GET /api/admin/applications (Admin Only)
router.get("/applications", protect, authorize("admin"), async (req, res) => {
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

// 🗑️ DELETE /api/admin/applications/:id (Admin Only)
router.delete("/applications/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ========================================================
// 📢 --- BROADCAST ENDPOINTS ---
// ========================================================

// ⚡ POST /api/admin/broadcast — Only Admin can deploy
router.post("/broadcast", protect, authorize("admin"), async (req, res) => {
  try {
    const { message, targetGroup } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Broadcast message is required" });
    }

    const newBroadcast = new Broadcast({
      message,
      targetGroup: targetGroup || "all",
      senderId: req.user._id,
    });

    await newBroadcast.save();
    res.status(201).json({ success: true, broadcast: newBroadcast });
  } catch (error) {
    res.status(500).json({ message: "Server error while creating broadcast", error: error.message });
  }
});

// ⚡ GET /api/admin/broadcasts — PUBLIC FOR RECRUITER & APPLICANT ALSO!
router.get("/broadcasts", protect, async (req, res) => {
  try {
    const broadcasts = await Broadcast.find()
      .populate("senderId", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, broadcasts });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching history", error: error.message });
  }
});

// ⚡ DELETE /api/admin/broadcast/:id — Only Admin can purge log
router.delete("/broadcast/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) return res.status(404).json({ message: "Broadcast warning log not found" });
    res.json({ message: "Broadcast deleted successfully from server logs" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting broadcast", error: error.message });
  }
});

export default router;
import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; 
import Broadcast from "../models/Broadcast.js"; 
import AuditLog from "../models/AuditLog.js"; 
import { protect, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();

// ========================================================
// 📊 DASHBOARD METRICS & CORE TRACKING
// ========================================================

// GET /api/admin/stats — System Architecture Statistics Overview
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
    res.status(500).json({ message: "Server error during counters processing", error: error.message });
  }
});

// ========================================================
// 👥 USER MATRIX CONTROL & ACCOUNT ACTIONS
// ========================================================

// GET /api/admin/users — Fetch users excluding admins with search index rules
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let queryCondition = { role: { $ne: "admin" } };

    if (role) queryCondition.role = role;
    if (status) queryCondition.status = status;
    if (search) {
      queryCondition.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(queryCondition)
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "User master records pull crashed", error: error.message });
  }
});

// PATCH /api/admin/users/:id/status — Toggle Block/Unblock Account
router.patch("/users/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "suspended", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid access status argument value" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User target key not found" });

    const logEntry = new AuditLog({
      action: "USER_STATUS_UPDATE",
      details: `Modified access permissions flag to [${status}] for target: ${user.name || "User"} (${user.email})`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server failure running user update modifier", error: error.message });
  }
});

// PATCH /api/admin/users/:id/role — Role-Based Access Level Modifier (Dynamic Role Assignment)
router.patch("/users/:id/role", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "recruiter", "applicant"].includes(role)) {
      return res.status(400).json({ message: "Invalid role target string parameter" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User record index signature lookup mismatch" });

    const logEntry = new AuditLog({
      action: "USER_ROLE_MIGRATED",
      details: `Elevated/re-routed systemic permissions role to [${role}] for profile: ${user.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server crash shifting account system privilege mapping", error: error.message });
  }
});

// DELETE /api/admin/users/:id — Permanent Account Deletion
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User matching key context missing" });

    await User.findByIdAndDelete(req.params.id);

    const logEntry = new AuditLog({
      action: "USER_DELETED",
      details: `Permanently destroyed account document for [${user.name}] | Unique email record trace: ${user.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ message: "User data wiped successfully from core production collections" });
  } catch (error) {
    res.status(500).json({ message: "Database deletion protocol breakdown execution error", error: error.message });
  }
});

// ========================================================
// 💼 JOBS MODULE DISCOVERY & SYSTEM MODIFICATIONS
// ========================================================

// GET /api/admin/jobs — Fetch global employment listings logs
router.get("/jobs", protect, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Job logs transaction lookup failure", error: error.message });
  }
});

// PATCH /api/admin/jobs/:id/status — Archive or change status configuration metrics
router.patch("/jobs/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job document reference map empty" });

    const logEntry = new AuditLog({
      action: "JOB_STATUS_UPDATE",
      details: `Modified recruitment position status tracking [${job.title}] updated to flag: ${status}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Job metadata pipeline transformation fault", error: error.message });
  }
});

// DELETE /api/admin/jobs/:id — Direct Admin Job Deletion
router.delete("/jobs/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job item signature block dropped" });

    await Job.findByIdAndDelete(req.params.id);

    const logEntry = new AuditLog({
      action: "JOB_DELETED",
      details: `Wiped active job registry record metadata entry: "${job.title}"`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ message: "Job registry item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server fault during execution block drop mapping", error: error.message });
  }
});

// ========================================================
// 🤖 APPLICATIONS PIPELINE MONITOR & ADVANCED MULTI-FILTERS
// ========================================================

// GET /api/admin/applications — Advanced Multi-parameter Search Filter System Engine
router.get("/applications", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, scoreMin, scoreMax, skills, jobTitle } = req.query;
    let queryCondition = {};

    if (status && status !== "all") {
      queryCondition.status = status;
    }

    // Dynamic numeric bounds range extraction for AI Analysis parsing scores
    if (scoreMin || scoreMax) {
      queryCondition["aiAnalysis.aiScore"] = {};
      if (scoreMin) queryCondition["aiAnalysis.aiScore"].$gte = parseInt(scoreMin);
      if (scoreMax) queryCondition["aiAnalysis.aiScore"].$lte = parseInt(scoreMax);
    }

    // Match skills tokens extracted inside tags array 
    if (skills) {
      const skillsArray = skills.split(",").map(skill => skill.trim());
      queryCondition["aiAnalysis.parsedSkills"] = { $all: skillsArray.map(s => new RegExp(s, "i")) };
    }

    const applications = await Application.find(queryCondition)
      .populate({
        path: "jobId",
        select: "title company location",
        match: jobTitle ? { title: { $regex: jobTitle, $options: "i" } } : {}
      }) 
      .populate("applicantId", "name email")      
      .sort({ createdAt: -1 });

    // Filter missing matching models dependencies pointers out
    const filteredApplications = applications.filter(app => app.jobId !== null);

    res.json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: "Complex filters extraction process fail handler crash", error: error.message });
  }
});

// DELETE /api/admin/applications/:id — Purge pipeline metadata index
router.delete("/applications/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application process node instance missing" });

    await Application.findByIdAndDelete(req.params.id);

    const logEntry = new AuditLog({
      action: "APPLICATION_PURGED",
      details: `Admin purged candidate application record document key identity string: ${req.params.id}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ message: "Application pipeline reference destroyed smoothly" });
  } catch (error) {
    res.status(500).json({ message: "Internal crash cleaning system data registers", error: error.message });
  }
});

// ========================================================
// 📢 BROADCAST ENGINES (NOTIFICATIONS FRAMEWORK)
// ========================================================

// POST /api/admin/broadcast — Push global notifications alert across sub-panels
router.post("/broadcast", protect, authorize("admin"), async (req, res) => {
  try {
    const { message, targetGroup } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Broadcast required parameter text field is null" });
    }

    const newBroadcast = new Broadcast({
      message,
      targetGroup: targetGroup || "all",
      senderId: req.user._id,
    });

    await newBroadcast.save();

    const logEntry = new AuditLog({
      action: "BROADCAST_CREATED",
      details: `Admin triggered global platform warning banner info message: "${message.substring(0, 40)}..." targeted to: [${targetGroup}]`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.status(201).json({ success: true, broadcast: newBroadcast });
  } catch (error) {
    res.status(500).json({ message: "Broadcast deployment schema creation block failed", error: error.message });
  }
});

// GET /api/admin/broadcasts — Public fetch route across applicant and recruiter entrypoints
router.get("/broadcasts", protect, async (req, res) => {
  try {
    const broadcasts = await Broadcast.find()
      .populate("senderId", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, broadcasts });
  } catch (error) {
    res.status(500).json({ message: "Server log verification check error tracing history", error: error.message });
  }
});

// DELETE /api/admin/broadcast/:id — Purge warning node context from database logs
router.delete("/broadcast/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) return res.status(404).json({ message: "System notice object lookup failed" });

    const logEntry = new AuditLog({
      action: "BROADCAST_DELETED",
      details: `Admin discarded alert warning module broadcast banner target container configuration`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ message: "Broadcast instance cleared successfully from cluster servers" });
  } catch (error) {
    res.status(500).json({ message: "Server error executing purge algorithm on target data array", error: error.message });
  }
});

// ========================================================
// 🛡️ SECURITY AUDIT MATRIX OPERATIONS
// ========================================================

// GET /api/admin/audit-logs — Administrative security trace history stream
router.get("/audit-logs", protect, authorize("admin"), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 }); 
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ message: "Audit ledger stack transaction extraction failure", error: error.message });
  }
});

// DELETE /api/admin/audit-logs/purge — Expired tracking system retention database clear engine
router.delete("/audit-logs/purge", protect, authorize("admin"), async (req, res) => {
  try {
    const { retentionDays } = req.body; 
    
    let queryCondition = {};
    if (retentionDays) {
      const cutOffDate = new Date();
      cutOffDate.setDate(cutOffDate.getDate() - parseInt(retentionDays));
      queryCondition = { createdAt: { $lt: cutOffDate } };
    }

    const result = await AuditLog.deleteMany(queryCondition);
    res.json({ 
      success: true, 
      message: `System transaction audit records cleared safely. Deleted count tracking: ${result.deletedCount} entries.` 
    });
  } catch (error) {
    res.status(500).json({ message: "Security governance logging sweep failed", error: error.message });
  }
});

export default router;
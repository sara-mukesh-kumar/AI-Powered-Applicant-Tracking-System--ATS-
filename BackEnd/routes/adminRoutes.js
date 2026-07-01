import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/application.js"; 
import Broadcast from "../models/Broadcast.js"; 
import AuditLog from "../models/AuditLog.js"; 
import { protect, authorize } from "../middleware/authMiddleware.js";
import AiConfig from "../models/AiConfig.js"; 


const router = express.Router();

// ========================================================
// ✉️ TRANSACTIONAL EMAIL ENDPOINT (MAPPED AT TOP)
// ========================================================
router.post("/send-email", protect, authorize("admin"), async (req, res) => {
  try {
    const { recipientEmail, subject, bodyText } = req.body;
    if (!recipientEmail || !bodyText) {
      return res.status(400).json({ message: "Recipient address and body text structure are required" });
    }
    const logEntry = new AuditLog({
      action: "EMAIL_DISPATCHED", 
      details: `Admin dispatched system communication template to candidate [${recipientEmail}] | Subject: ${subject}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();
    return res.status(200).json({ success: true, message: "Transactional system communication logged safely" });
  } catch (error) {
    return res.status(500).json({ message: "Email logger transmission failure", error: error.message });
  }
});

// ========================================================
// 📊 DASHBOARD METRICS, AI COUNTERS & AGGREGATIONS
// ========================================================
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalApplicants = await User.countDocuments({ role: "applicant" });
    const totalApplications = await Application.countDocuments(); 

    // ✅ NEW: AI Usage Count & Failed Parsing Metrics
    const aiUsageCount = await Application.countDocuments({ aiScore: { $exists: true, $ne: null } });
    const failedParsingCount = await Application.countDocuments({ 
      $or: [
        { aiScore: { $exists: false } },
        { aiScore: null }
      ]
    }) || 0;

    // 🧠 Dynamic Aggregation for AI Score Distribution Breakdown
    const scoreBuckets = await Application.aggregate([
      {
        $bucket: {
          groupBy: { $ifNull: ["$aiScore", 0] },
          boundaries: [0, 40, 70, 85, 101],
          default: "Unknown",
          output: { count: { $sum: 1 } }
        }
      }
    ]).catch(() => []);

    const formattedScoreDistribution = [
      { range: "0-40 (Critical)", count: 0 },
      { range: "41-70 (Average)", count: 0 },
      { range: "71-85 (Competitive)", count: 0 },
      { range: "86-100 (Exceptional)", count: 0 }
    ];

    scoreBuckets.forEach(b => {
      if (b._id === 0) formattedScoreDistribution[0].count = b.count;
      if (b._id === 40) formattedScoreDistribution[1].count = b.count;
      if (b._id === 70) formattedScoreDistribution[2].count = b.count;
      if (b._id === 85) formattedScoreDistribution[3].count = b.count;
    });

    // Fallback static structure until teammate creates "missingSkills" schema
    const formattedMissingSkills = [
      { skill: "DOCKER", frequency: 12 },
      { skill: "TYPESCRIPT", frequency: 9 },
      { skill: "AWS S3", frequency: 8 },
      { skill: "REDIS QUEUES", frequency: 6 },
      { skill: "GRAPHQL", frequency: 4 }
    ];

    res.json({
      totalJobs,
      totalApplications, 
      totalRecruiters,
      totalApplicants,
      aiUsageCount,         // Exported to Frontend
      failedParsingCount,   // Exported to Frontend
      scoreDistribution: formattedScoreDistribution,
      missingSkills: formattedMissingSkills
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during counters processing", error: error.message });
  }
});

// ========================================================
// 📢 BROADCAST ENGINES (GLOBAL BANNER NOTIFICATIONS)
// ========================================================
router.post("/broadcast", protect, authorize("admin"), async (req, res) => {
  try {
    const { message, targetGroup } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Broadcast required parameter text field is null" });
    }
    const newBroadcast = new Broadcast({ message, targetGroup: targetGroup || "all", senderId: req.user._id });
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

router.get("/broadcasts", protect, async (req, res) => {
  try {
    const broadcasts = await Broadcast.find().populate("senderId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, broadcasts });
  } catch (error) {
    res.status(500).json({ message: "Server log verification check error tracing history", error: error.message });
  }
});

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
    res.json({ message: "Broadcast instance cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error executing purge algorithm", error: error.message });
  }
});

// ========================================================
// 👥 USER CONTROL MATRIX
// ========================================================
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
    const users = await User.find(queryCondition).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "User master records pull crashed", error: error.message });
  }
});

router.patch("/users/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User target key not found" });
    const logEntry = new AuditLog({
      action: "USER_STATUS_UPDATE",
      details: `Modified access permissions to [${status}] for ${user.name} (${user.email})`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server failure running user status update", error: error.message });
  }
});

router.patch("/users/:id/role", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User record lookup mismatch" });
    const logEntry = new AuditLog({
      action: "USER_ROLE_MIGRATED",
      details: `Elevated systemic permissions role to [${role}] for profile: ${user.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error shifting privilege mapping", error: error.message });
  }
});

router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User missing" });
    await User.findByIdAndDelete(req.params.id);
    const logEntry = new AuditLog({
      action: "USER_DELETED",
      details: `Permanently destroyed account document for [${user.name}] (${user.email})`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();
    res.json({ message: "User data wiped successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database deletion protocol execution error", error: error.message });
  }
});

// ========================================================
// 💼 JOBS MANAGEMENT MODULE
// ========================================================
router.get("/jobs", protect, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Job logs transaction lookup failure", error: error.message });
  }
});

router.patch("/jobs/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ message: "Job document reference empty" });
    const logEntry = new AuditLog({
      action: "JOB_STATUS_UPDATE",
      details: `Modified recruitment position status tracking [${job.title}] to flag: ${status}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Job metadata pipeline transformation fault", error: error.message });
  }
});

router.delete("/jobs/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job item signature missing" });
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
// 🤖 APPLICATIONS MONITOR MATRIX
// ========================================================
router.get("/applications", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, scoreMin, scoreMax, skills, jobTitle } = req.query;
    let queryCondition = {};
    if (status && status !== "all") queryCondition.status = status;
    if (scoreMin || scoreMax) {
      queryCondition["aiScore"] = {};
      if (scoreMin) queryCondition["aiScore"].$gte = parseInt(scoreMin);
      if (scoreMax) queryCondition["aiScore"].$lte = parseInt(scoreMax);
    }
    if (skills) {
      const skillsArray = skills.split(",").map(skill => skill.trim());
      queryCondition["extractedSkills"] = { $all: skillsArray.map(s => new RegExp(s, "i")) };
    }
    const applications = await Application.find(queryCondition)
      .populate({ path: "jobId", select: "title company location", match: jobTitle ? { title: { $regex: jobTitle, $options: "i" } } : {} }) 
      .populate("applicantId", "name email")      
      .sort({ createdAt: -1 });
    const filteredApplications = applications.filter(app => app.jobId !== null);
    res.json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: "Complex filters extraction process fail", error: error.message });
  }
});

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
    res.json({ message: "Application pipeline reference destroyed" });
  } catch (error) {
    res.status(500).json({ message: "Internal crash cleaning system data registers", error: error.message });
  }
});

// ========================================================
// 🛡️ SECURITY AUDIT MATRIX
// ========================================================
router.get("/audit-logs", protect, authorize("admin"), async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("performedBy", "name email").sort({ createdAt: -1 }); 
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ message: "Audit ledger stack transaction extraction failure", error: error.message });
  }
});

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
    res.json({ success: true, message: `Purged count: ${result.deletedCount} entries.` });
  } catch (error) {
    res.status(500).json({ message: "Security governance logging sweep failed", error: error.message });
  }
});
// ========================================================
// 👥 ADVANCED USER ACCOUNT MANAGEMENT ENGINES
// ========================================================

// PATCH /api/admin/users/:id/reset-password — Force Reset User Password
router.patch("/users/:id/reset-password", protect, authorize("admin"), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User profile signature not found" });

    // Update password (agar aapke User model mein .pre('save') brypt hook laga hai toh ye auto-hash hoga)
    user.password = newPassword;
    await user.save();

    // 🛡️ Create System Audit Log
    const logEntry = new AuditLog({
      action: "USER_PASSWORD_RESET",
      details: `Administrative override: Forced password reset execution completed for account: ${user.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ success: true, message: `Password changed successfully for user: ${user.name}` });
  } catch (error) {
    res.status(500).json({ message: "Server crash resetting user password matrix", error: error.message });
  }
});

// POST /api/admin/users/:id/revoke-sessions — Kill Active User JWT Sessions
router.post("/users/:id/revoke-sessions", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Target account signature mismatch" });

    // Token revocation standard practice: Increment context token/session version identifier count
    // Agar model mein abhi tokenVersion field nahi hai, toh runtime fallback par log track persist karega
    user.tokenVersion = (user.tokenVersion || 0) + 1; 
    await user.save();

    // 🛡️ Log session clearance event
    const logEntry = new AuditLog({
      action: "USER_SESSION_REVOKED",
      details: `Administrative termination: Revoked all active authentication sessions tokens for: ${user.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ success: true, message: `Successfully revoked all active active tokens and sessions for: ${user.name}` });
  } catch (error) {
    res.status(500).json({ message: "Internal gateway crash terminating active sessions", error: error.message });
  }
});


// ========================================================
// 🤖 AI SCORING STRATEGY CONTROL ENDPOINTS
// ========================================================

// GET /api/admin/ai-config/:profileType — Fetch weight ratios
router.get("/ai-config/:profileType", protect, authorize("admin"), async (req, res) => {
  try {
    let config = await AiConfig.findOne({ profileType: req.params.profileType });
    
    // Default strategy backup layer if empty database record instances found
    if (!config) {
      config = {
        profileType: req.params.profileType,
        weights: { keywordMatch: 30, skillsTaxonomy: 35, experienceDuration: 20, educationFormatting: 15 },
        minimumPassingScore: 60
      };
    }
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ message: "AI rules parsing ledger mapping crashed", error: error.message });
  }
});

// POST /api/admin/ai-config/save — Update or Create global weighting criteria 
router.post("/ai-config/save", protect, authorize("admin"), async (req, res) => {
  try {
    const { profileType, weights, minimumPassingScore } = req.body;
    
    // Mathematical boundary constraint validation check total ratios sum = 100%
    const totalWeightsSum = Number(weights.keywordMatch) + Number(weights.skillsTaxonomy) + 
                            Number(weights.experienceDuration) + Number(weights.educationFormatting);
                            
    if (totalWeightsSum !== 100) {
      return res.status(400).json({ message: `Total strategy constraint matrix weights sum must equal strictly 100%. Current sum: ${totalWeightsSum}%` });
    }

    const updatedConfig = await AiConfig.findOneAndUpdate(
      { profileType },
      { weights, minimumPassingScore },
      { new: true, upsert: true }
    );

    // 🛡️ Log execution audit records
    const logEntry = new AuditLog({
      action: "AI_SCORING_TUNED",
      details: `Admin customized AI calculation constraints profiles weights for [${profileType.toUpperCase()}] matrix configuration rules.`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await logEntry.save();

    res.json({ success: true, message: "AI strategic optimization weights saved into cluster core schemas.", config: updatedConfig });
  } catch (error) {
    res.status(500).json({ message: "Strategic config storage pipeline broke", error: error.message });
  }
});

export default router;
/**
 * ============================================
 * RECRUITER ROUTES
 * ============================================
 * Handles recruiter-specific operations:
 * - View their own job postings
 * - View applications for their jobs
 * - Manage application status (Interview, Offered, Rejected)
 * - View team/company statistics
 */

import express from "express";
import Job from "../models/Job.js";
import Application from "../models/application.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

/**
 * ============================================
 * JOB MANAGEMENT ENDPOINTS
 * ============================================
 */

// @route   GET /api/recruiter/jobs
// @desc    Get all jobs posted by the recruiter
// @access  Private (Recruiter only)
router.get("/jobs", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let queryCondition = { recruiterId: req.user._id };

    if (status) {
      queryCondition.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(queryCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(queryCondition);

    // Get application counts for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    res.status(200).json({
      jobs: jobsWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/recruiter/jobs/:jobId
// @desc    Get detailed stats for a specific job
// @access  Private (Recruiter only)
router.get("/jobs/:jobId", protect, authorize("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Authorization: Recruiter can only view own jobs
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this job" });
    }

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { jobId: job._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get AI score distribution
    const scoreDistribution = await Application.aggregate([
      { $match: { jobId: job._id } },
      {
        $group: {
          _id: {
            $cond: [
              { $gte: ["$aiScore", 80] },
              "Excellent (80+)",
              {
                $cond: [
                  { $gte: ["$aiScore", 60] },
                  "Good (60-79)",
                  {
                    $cond: [
                      { $gte: ["$aiScore", 40] },
                      "Fair (40-59)",
                      "Poor (<40)"
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      job,
      applicationStats: Object.fromEntries(
        applicationStats.map(stat => [stat._id, stat.count])
      ),
      scoreDistribution,
      totalApplications: applicationStats.reduce((sum, stat) => sum + stat.count, 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * APPLICATION MANAGEMENT ENDPOINTS
 * ============================================
 */

// @route   GET /api/recruiter/applications
// @desc    Get all applications for recruiter's jobs with filtering
// @access  Private (Recruiter only)
router.get("/applications", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { jobId, status, minScore, maxScore, page = 1, limit = 10 } = req.query;

    // Get all jobs belonging to this recruiter
    const recruiterJobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = recruiterJobs.map(j => j._id);

    if (jobIds.length === 0) {
      return res.status(200).json({ applications: [], pagination: { total: 0, page, limit, pages: 0 } });
    }

    let queryCondition = { jobId: { $in: jobIds } };

    // Filter by specific job if provided
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to view applications for this job" });
      }
      queryCondition.jobId = jobId;
    }

    // Filter by status
    if (status) {
      queryCondition.status = status;
    }

    // Filter by AI score range
    if (minScore) {
      queryCondition.aiScore = { $gte: parseInt(minScore) };
    }
    if (maxScore) {
      queryCondition.aiScore = {
        ...queryCondition.aiScore,
        $lte: parseInt(maxScore)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(queryCondition)
      .populate("jobId", "title description requiredSkills")
      .populate("applicantId", "name email skills designation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(queryCondition);

    res.status(200).json({
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/recruiter/applications/:applicationId
// @desc    Get detailed view of a single application
// @access  Private (Recruiter only)
router.get("/applications/:applicationId", protect, authorize("recruiter"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate("jobId")
      .populate("applicantId", "-password");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if recruiter owns the job
    const job = await Job.findById(application.jobId._id);
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PATCH /api/recruiter/applications/:applicationId/status
// @desc    Update application status (Interview, Offered, Rejected)
// @access  Private (Recruiter only)
router.patch("/applications/:applicationId/status", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ["Applied", "Interview", "Offered", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: Applied, Interview, Offered, Rejected" 
      });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization
    const job = await Job.findById(application.jobId);
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    // Update status
    const previousStatus = application.status;
    application.status = status;

    if (notes) {
      application.notes = notes;
    }

    await application.save();

    // Create audit log
    const auditLog = new AuditLog({
      action: "APPLICATION_STATUS_UPDATED",
      details: `Application status changed from ${previousStatus} to ${status}. Applicant: ${(await application.populate("applicantId")).applicantId.email}`,
      performedBy: req.user._id,
      ipAddress: req.ip
    });
    await auditLog.save();

    const updatedApplication = await application.populate([
      { path: "jobId", select: "title" },
      { path: "applicantId", select: "name email" }
    ]);

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * RECRUITER DASHBOARD ENDPOINTS
 * ============================================
 */

// @route   GET /api/recruiter/dashboard
// @desc    Get recruiter dashboard statistics
// @access  Private (Recruiter only)
router.get("/dashboard", protect, authorize("recruiter"), async (req, res) => {
  try {
    // Get recruiter's jobs
    const recruiterJobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = recruiterJobs.map(j => j._id);

    const totalJobs = recruiterJobs.length;
    const openJobs = recruiterJobs.filter(j => j.status === "open").length;
    const closedJobs = recruiterJobs.filter(j => j.status === "closed").length;

    // Get application statistics
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    const applicationsByStatus = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get average AI score
    const scoreStats = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$aiScore" },
          maxScore: { $max: "$aiScore" },
          minScore: { $min: "$aiScore" }
        }
      }
    ]);

    // Get recent applications
    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title")
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        applicationsByStatus: Object.fromEntries(
          applicationsByStatus.map(stat => [stat._id, stat.count])
        ),
        averageScore: scoreStats[0]?.averageScore || 0,
        maxScore: scoreStats[0]?.maxScore || 0,
        minScore: scoreStats[0]?.minScore || 0
      },
      recentApplications
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * RECRUITER PROFILE ENDPOINTS
 * ============================================
 */

// @route   GET /api/recruiter/profile
// @desc    Get recruiter's profile information
// @access  Private (Recruiter only)
router.get("/profile", protect, authorize("recruiter"), async (req, res) => {
  try {
    const recruiter = await User.findById(req.user._id).select("-password");
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/recruiter/profile
// @desc    Update recruiter's profile
// @access  Private (Recruiter only)
router.put("/profile", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { name, designation, location, summary, phone, company } = req.body;

    const recruiter = await User.findById(req.user._id);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Update allowed fields
    if (name) recruiter.name = name;
    if (designation) recruiter.designation = designation;
    if (location) recruiter.location = location;
    if (summary) recruiter.summary = summary;
    if (phone) recruiter.phone = phone;
    if (company) recruiter.company = company;

    await recruiter.save();

    const updated = await User.findById(recruiter._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/recruiter/resume/:filename
// @desc    Download applicant's resume
// @access  Private (Recruiter only)
router.get("/resume/:filename", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found"
      });
    }

    // Send file as download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Failed to download file"
          });
        }
      }
    });
  } catch (error) {
    console.error("Resume download error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download resume"
    });
  }
});

export default router;

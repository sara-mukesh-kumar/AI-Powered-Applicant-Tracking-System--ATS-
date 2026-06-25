import express from "express";
import Job from "../models/Job.js";
import Application from "../models/application.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ============================================
 * JOB LISTING & BROWSING ENDPOINTS
 * ============================================
 */

// @route   GET /api/jobs
// @desc    Get all open jobs with optional search/filters
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { search, skills, experienceLevel, page = 1, limit = 10 } = req.query;
    let queryCondition = { status: "open" };

    // Search by title or description
    if (search) {
      queryCondition.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by required skills
    if (skills) {
      const skillsArray = skills.split(",").map(s => s.trim());
      queryCondition.requiredSkills = { $in: skillsArray };
    }

    // Filter by experience level
    if (experienceLevel) {
      queryCondition.experienceLevel = experienceLevel;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(queryCondition)
      .populate("recruiterId", "name email designation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(queryCondition);

    res.status(200).json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job details with application stats
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email designation");
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get application statistics for this job
    const applicationStats = await Application.aggregate([
      { $match: { jobId: job._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Check if current user has applied
    let hasApplied = false;
    let applicationStatus = null;

    if (req.user.role === "applicant") {
      const existingApplication = await Application.findOne({
        jobId: job._id,
        applicantId: req.user._id
      });

      if (existingApplication) {
        hasApplied = true;
        applicationStatus = existingApplication.status;
      }
    }

    res.status(200).json({
      job,
      applicationStats: Object.fromEntries(
        applicationStats.map(stat => [stat._id, stat.count])
      ),
      hasApplied,
      applicationStatus
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * ============================================
 * JOB POSTING ENDPOINTS (RECRUITER/ADMIN)
 * ============================================
 */

// @route   POST /api/jobs
// @desc    Create a new job (ONLY Recruiters or Admins)
// @access  Private
router.post("/", protect, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceLevel, location, salary } = req.body;

    // Validation
    if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ 
        message: "Title, description, and at least one skill are required" 
      });
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experienceLevel: experienceLevel || "Entry Level",
      location: location || "Remote",
      salary: salary || "Not specified",
      recruiterId: req.user._id,
      status: "open"
    });

    const populatedJob = await job.populate("recruiterId", "name email designation");
    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job details (Recruiter can update own jobs, Admin can update any)
// @access  Private
router.put("/:id", protect, authorize("recruiter", "admin"), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Authorization check: Recruiter can only update own jobs
    if (req.user.role === "recruiter" && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, requiredSkills, experienceLevel, location, salary } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (requiredSkills) job.requiredSkills = requiredSkills;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (location) job.location = location;
    if (salary) job.salary = salary;

    await job.save();
    const populatedJob = await job.populate("recruiterId", "name email designation");

    res.status(200).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Recruiter can delete own, Admin can delete any)
// @access  Private
router.delete("/:id", protect, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Authorization check
    if (req.user.role === "recruiter" && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    // Delete all applications for this job
    await Application.deleteMany({ jobId: job._id });

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
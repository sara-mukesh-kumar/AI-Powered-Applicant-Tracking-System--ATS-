import express from "express";
import User from "../models/User.js";
import Application from "../models/application.js";
import Job from "../models/Job.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload, parseResumeFile } from "../utils/fileUpload.js";
import { calculateAIScore, extractSkillsFromResume } from "../utils/aiScoring.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

/**
 * ============================================
 * PROFILE MANAGEMENT ENDPOINTS
 * ============================================
 */

// @route   GET /api/applicant/profile
// @desc    Get the logged-in applicant's profile details
// @access  Private
router.get("/profile", protect, authorize("applicant"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/applicant/profile
// @desc    Update the logged-in applicant's profile details
// @access  Private
router.put("/profile", protect, authorize("applicant"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowable fields
    const fieldsToUpdate = [
      "name",
      "designation",
      "location",
      "summary",
      "skills",
      "experience",
      "education",
      "privacy",
      "alerts"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * RESUME UPLOAD ENDPOINT
 * ============================================
 */

// @route   POST /api/applicant/upload-resume
// @desc    Upload and store applicant's resume, extract skills
// @access  Private
router.post("/upload-resume", protect, authorize("applicant"), upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded. Please select a file." 
      });
    }

    // Parse resume file and extract text
    const parsedResume = await parseResumeFile(req.file);

    // Get current user data to access existing skills
    const currentUser = await User.findById(req.user._id);

    // Extract skills from resume using AI engine
    const extractedSkills = extractSkillsFromResume(
      parsedResume.text,
      currentUser.experience || [],
      currentUser.skills || []
    );

    // Merge extracted skills with existing skills (avoid duplicates)
    const existingSkills = new Set(currentUser.skills || []);
    const mergedSkills = Array.from(
      new Set([...existingSkills, ...extractedSkills])
    );

    // Update user with resume URL and new skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        resumeUrl: parsedResume.url,
        skills: mergedSkills 
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully and skills extracted",
      resumeUrl: parsedResume.url,
      filename: parsedResume.filename,
      extractedSkills: Array.from(extractedSkills),
      allSkills: mergedSkills,
      user
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to upload resume", 
      error: error.message 
    });
  }
});

// @route   GET /api/applicant/resume/:filename
// @desc    Download resume file
// @access  Private
router.get("/resume/:filename", protect, authorize("applicant"), async (req, res) => {
  try {
    const { filename } = req.params;

    // Verify user owns this resume
    const user = await User.findById(req.user._id);
    if (!user || !user.resumeUrl?.includes(filename)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to download this file"
      });
    }

    const filePath = path.join(__dirname, "../uploads", filename);

    // Check if file exists
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

/**
 * ============================================
 * APPLICATION MANAGEMENT ENDPOINTS
 * ============================================
 */

// @route   POST /api/applicant/apply/:jobId
// @desc    Submit an application for a job
// @access  Private
router.post("/apply/:jobId", protect, authorize("applicant"), async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user._id;

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Get applicant details for AI scoring
    const applicant = await User.findById(applicantId);
    
    // Extract skills from resume
    const extractedSkills = extractSkillsFromResume(
      applicant.resumeUrl || "",
      applicant.experience || [],
      applicant.skills || []
    );

    // Calculate AI score
    const aiScoringResult = calculateAIScore(
      job.requiredSkills,
      extractedSkills,
      applicant.experience || [],
      job.description
    );

    // Create application
    const application = await Application.create({
      jobId,
      applicantId,
      resumeUrl: applicant.resumeUrl || "No resume uploaded",
      status: "Applied",
      aiScore: aiScoringResult.aiScore,
      aiSummary: aiScoringResult.aiSummary,
      extractedSkills: aiScoringResult.extractedSkills,
      notes: req.body.note || req.body.notes || ""
    });

    // Populate references
    const populatedApplication = await application.populate([
      { path: "jobId", select: "title description requiredSkills" },
      { path: "applicantId", select: "name email skills" }
    ]);

    res.status(201).json({
      message: "Application submitted successfully",
      application: populatedApplication,
      aiScore: aiScoringResult.aiScore,
      matchDetails: aiScoringResult.matchDetails
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/applicant/applications
// @desc    Get all applications submitted by the logged-in applicant
// @access  Private
router.get("/applications", protect, authorize("applicant"), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let queryCondition = { applicantId: req.user._id };

    // Filter by status if provided
    if (status) {
      queryCondition.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(queryCondition)
      .populate("jobId", "title description company location salary requiredSkills")
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

// @route   GET /api/applicant/applications/:id
// @desc    Get single application details
// @access  Private
router.get("/applications/:id", protect, authorize("applicant"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("applicantId", "-password");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify ownership
    if (application.applicantId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PATCH /api/applicant/applications/:id/withdraw
// @desc    Withdraw an application
// @access  Private
router.patch("/applications/:id/withdraw", protect, authorize("applicant"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify ownership
    if (application.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    // Can't withdraw if already in interview or offered stage
    if (["Interview", "Offered"].includes(application.status)) {
      return res.status(400).json({ 
        message: "Cannot withdraw application at this stage" 
      });
    }

    application.status = "Withdrawn";
    await application.save();

    res.status(200).json({ 
      message: "Application withdrawn successfully",
      application 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * SAVED JOBS ENDPOINTS
 * ============================================
 */

// @route   POST /api/applicant/save/:jobId
// @desc    Save a job for later
// @access  Private
router.post("/save/:jobId", protect, authorize("applicant"), async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get user and check if already saved
    const user = await User.findById(req.user._id);
    
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({
      message: "Job saved successfully",
      savedJobsCount: user.savedJobs.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/applicant/save/:jobId
// @desc    Remove a saved job
// @access  Private
router.delete("/save/:jobId", protect, authorize("applicant"), async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (!user.savedJobs.includes(jobId)) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({
      message: "Saved job removed successfully",
      savedJobsCount: user.savedJobs.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/applicant/saved-jobs
// @desc    Get all saved jobs for the applicant
// @access  Private
router.get("/saved-jobs", protect, authorize("applicant"), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user._id)
      .populate({
        path: "savedJobs",
        model: "Job",
        skip: skip,
        limit: parseInt(limit)
      });

    const totalSaved = user.savedJobs.length;

    res.status(200).json({
      savedJobs: user.savedJobs,
      pagination: {
        total: totalSaved,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalSaved / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ============================================
 * DOCUMENT VAULT ENDPOINTS
 * ============================================
 */

// @route   GET /api/applicant/documents
// @desc    Get all vault documents for the logged-in applicant
// @access  Private
router.get("/documents", protect, authorize("applicant"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.documents || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/applicant/documents
// @desc    Upload document to applicant's vault
// @access  Private
router.post("/documents", protect, authorize("applicant"), upload.single("file"), async (req, res) => {
  try {
    const { category } = req.body;
    let name = req.body.name;
    let url = req.body.url;

    // If file is uploaded, use its properties
    if (req.file) {
      name = name || req.file.originalname;
      url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!name) {
      return res.status(400).json({ message: "Document name or file is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.documents.push({
      name,
      url,
      category: category || "resume"
    });

    await user.save();
    
    // Return all documents as expected by frontend
    res.status(201).json(user.documents);
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/applicant/documents/:id
// @desc    Delete a document from applicant's vault
// @access  Private
router.delete("/documents/:id", protect, authorize("applicant"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const docToDelete = user.documents.find(doc => doc._id.toString() === req.params.id);
    if (!docToDelete) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Try to delete physical file if it's hosted locally
    if (docToDelete.url && docToDelete.url.includes("/uploads/")) {
      const filename = docToDelete.url.split("/").pop();
      const filePath = path.join(__dirname, "../uploads", filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Failed to delete physical file:", err.message);
        }
      }
    }

    user.documents = user.documents.filter(doc => doc._id.toString() !== req.params.id);
    await user.save();

    res.status(200).json(user.documents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

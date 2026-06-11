import express from "express";
import Job from "../models/Job.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job (ONLY Recruiters or Admins can do this)
router.post("/", protect, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceLevel } = req.body;

    // Create the job and attach the logged-in recruiter's ID
    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experienceLevel,
      recruiterId: req.user._id, // This comes from the 'protect' middleware
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/jobs
// @desc    Get all open jobs (Anyone can view jobs)
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }).populate("recruiterId", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
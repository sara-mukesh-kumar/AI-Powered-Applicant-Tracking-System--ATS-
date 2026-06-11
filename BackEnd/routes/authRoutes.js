import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Validate role input
    const validRoles = ["applicant", "recruiter", "admin"];
    const assignedRole = validRoles.includes(role) ? role : "applicant";

    const user = await User.create({ name, email, password, role: assignedRole });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("🔥 BACKEND CRASH ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("🔥 BACKEND CRASH ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/auth/me (Protected Route Example)
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// @route GET /api/auth/admin-only (Role Route Example)
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import dns from "node:dns";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicantRoutes from "./routes/applicantRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

dotenv.config();
console.log(process.env.MONGO_URI);
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/applicant", applicantRoutes);
app.use("/api/recruiter", recruiterRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("ATS API is running...");
});

// Error handling middleware for multer and other errors
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  // Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        success: false,
        message: "File size exceeds 5MB limit" 
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ 
        success: false,
        message: "Too many files" 
      });
    }
  }
  
  // Custom file validation errors
  if (err.message && err.message.includes("Only") && err.message.includes("allowed")) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
  
  // Generic error
  res.status(500).json({ 
    success: false,
    message: err.message || "Server error" 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
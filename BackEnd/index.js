import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import dns from "node:dns";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicantRoutes from "./routes/applicantRoutes.js";

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

// Test Route
app.get("/", (req, res) => {
  res.send("ATS API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
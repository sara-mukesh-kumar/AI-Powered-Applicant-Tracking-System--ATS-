import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Applicant
import ApplicantDashboard from "./components/Applicant/ApplicantDashboard";
import ApplicantProfile from "./components/Applicant/ApplicantProfile";
import JobListings from "./components/Applicant/JobListings";
import JobDetails from "./components/Applicant/JobDetails";
import ResumeUpload from "./components/Applicant/ResumeUpload";

// Admin
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminJobsOverview from "./components/Admin/AdminJobsOverview";
import AdminApplicationsMonitor from "./components/Admin/AdminApplicationsMonitor";

// Recruiter
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterLayout from "./components/Recruiter/RecruiterLayout";
import RecruiterProfile from "./components/Recruiter/RecruiterProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsOverview />} />
          <Route path="applications" element={<AdminApplicationsMonitor />} />
          <Route path="users" element={<AdminUserManagement />} />
        </Route>

        {/* Applicant Routes */}
        <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
        <Route path="/applicant/profile" element={<ApplicantProfile />} />
        <Route path="/applicant/jobdetails" element={<JobDetails />} />
        <Route path="/applicant/joblisting" element={<JobListings />} />
        <Route path="/applicant/resumeupload" element={<ResumeUpload />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfile />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
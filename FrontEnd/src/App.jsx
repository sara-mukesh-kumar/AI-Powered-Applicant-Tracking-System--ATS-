import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Auth Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Registration";

// Admin Components
// import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminJobsOverview from "./components/Admin/AdminJobsOverview";
import AdminApplicationsMonitor from "./components/Admin/AdminApplicationsMonitor";

// Recruiter Components
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterLayout from "./components/Recruiter/RecruiterLayout";
import RecruiterNavbar from "./components/Recruiter/RecruiterNavbar";

import RecruiterProfile from "./components/Recruiter/RecruiterProfile";
// import RecruiterNavbar from "./components/Recruiter/RecruiterNavbar";
// import RecruiterSidebar from "./components/Recruiter/RecruiterSidebar";

// Applicant Components
// Note: You should ideally have an ApplicantLayout just like AdminLayout. 
// Using ApplicantDashboard as a wrapper might break your UI if it doesn't have an <Outlet />
import ApplicantDashboard from "./components/Applicant/ApplicantDashboard";
import ApplicantProfile from "./components/Applicant/ApplicantProfile";
import JobDetails from "./components/Applicant/JobDetails";
import ResumeUpload from "./components/Applicant/ResumeUpload";

// ==========================================
// ROLE-BASED PROTECTED ROUTE COMPONENT
// ==========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. If not logged in, send to login page
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 2. If user's role is not in the allowed list, kick them out
  if (!allowedRoles.includes(user.role)) {
    // Redirect them to their proper dashboard
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/applicant/dashboard" replace />;
  }

  // 3. Authorized! Render the layout.
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

        {/* ================= ADMIN ROUTES ================= */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsOverview />} />
          <Route path="applications" element={<AdminApplicationsMonitor />} />
          <Route path="users" element={<AdminUserManagement />} />
        </Route>

        {/* ================= RECRUITER ROUTES ================= */}
        <Route 
          path="/recruiter" 
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>

        {/* ================= APPLICANT ROUTES ================= */}
        {/* Make sure your ApplicantDashboard component has an <Outlet /> inside it, 
            otherwise the nested routes (profile, jobDetails) will not show up! */}
        <Route 
          path="/applicant" 
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ApplicantDashboard />} />
          <Route path="profile" element={<ApplicantProfile />} />
          <Route path="jobDetails" element={<JobDetails />} />
          <Route path="resumeupload" element={<ResumeUpload />} />
        </Route>

        </Routes>
      </BrowserRouter>
  );
}

export default App;
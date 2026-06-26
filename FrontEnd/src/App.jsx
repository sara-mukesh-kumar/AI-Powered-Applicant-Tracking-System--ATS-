import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";

// Auth Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Registration";

// Admin Components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminJobsOverview from "./components/Admin/AdminJobsOverview";
import AdminApplicationsMonitor from "./components/Admin/AdminApplicationsMonitor";
import AdminBroadcast from "./components/Admin/AdminBroadcast";
import AdminAuditLogs from "./components/Admin/AdminAuditLogs"; // 👈 NEWLY ADDED IMPORT

// Recruiter Components
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterLayout from "./components/Recruiter/RecruiterLayout";
import RecruiterNavbar from "./components/Recruiter/RecruiterNavbar";
import RecruiterProfile from "./components/Recruiter/RecruiterProfile";

// Applicant Components
import ApplicantDashboard from "./components/Applicant/ApplicantDashboard";
import ApplicantProfile from "./components/Applicant/ApplicantProfile";
import ApplicationTracker from "./components/Applicant/ApplicationTracker";
import JobListings from "./components/Applicant/JobListings";
import JobDetails from "./components/Applicant/JobDetails";
import DocumentVault from "./components/Applicant/DocumentVault";
import SavedJobs from "./components/Applicant/SavedJobs";
import ApplicantLayout from "./components/Applicant/ApplicantLayout";
import ApplicantAnalytics from "./components/Applicant/ApplicantAnalytics";
import ApplicantPrivacy from "./components/Applicant/ApplicantPrivacy";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/applicant/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          <Route path="broadcast" element={<AdminBroadcast />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} /> {/* 👈 NEWLY ADDED AUDIT ROUTE */}
        </Route>

        {/* ================= RECRUITER ROUTES ================= */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>

        {/* ================= APPLICANT ROUTES ================= */}
        <Route
          path="/applicant"
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <ApplicantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ApplicantDashboard />} />
          <Route path="profile" element={<ApplicantProfile />} />
          <Route path="joblisting" element={<JobListings />} />
          <Route path="jobDetails" element={<JobDetails />} />
          <Route path="tracker" element={<ApplicationTracker />} />
          <Route path="resumeupload" element={<DocumentVault />} />
          <Route path="savedjobs" element={<SavedJobs />} />
          <Route path="analytics" element={<ApplicantAnalytics />} />
          <Route path="privacy" element={<ApplicantPrivacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
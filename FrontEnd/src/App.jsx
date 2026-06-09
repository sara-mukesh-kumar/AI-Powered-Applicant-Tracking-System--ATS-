import React from "react";
import { useState } from 'react'
import './App.css'
import ApplicantDashboard from './components/Applicant/ApplicantDashboard'
// import JobListings from './components/Applicant/JobListings'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminJobsOverview from "./components/Admin/AdminJobsOverview";
import AdminApplicationsMonitor from "./components/Admin/AdminApplicationsMonitor";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterLayout from "./components/Recruiter/RecruiterLayout";
import RecruiterNavbar from "./components/Recruiter/RecruiterNavbar";

import RecruiterProfile from "./components/Recruiter/RecruiterProfile";
import RecruiterSidebar from "./components/Recruiter/RecruiterSidebar";
import ApplicantProfile from "./components/Applicant/ApplicantProfile";
import JobDetails from "./components/Applicant/JobDetails";
import ResumeUpload from "./components/Applicant/ResumeUpload";



function AdminProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Route temporarily hataya */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobsOverview />} />
            <Route path="applications" element={<AdminApplicationsMonitor />} />
            <Route path="users" element={<AdminUserManagement />} />

          </Route>

          {/* Applicant routes */}
          <Route path="/applicant" element={<ApplicantDashboard />} >
           <Route index element={<Navigate to="dashboard" replace />} />
           <Route path="dashboard" element={<ApplicantDashboard />}/>
           <Route path="profile" element={<ApplicantProfile />}/>
           {/* <Route path="tracker" element={<ApplicantionTracker />}/> */}
           <Route path="jobDetails" element={<JobDetails />}/>
           {/* <Route path="joblisting" element={<Joblistings />}/> */}
           <Route path="resumeupload" element={<ResumeUpload />}/>
          </Route>

          {/* Recruiter routes */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="navbar" element={<RecruiterNavbar />} />
            <Route path="sidebar" element={<RecruiterSidebar />} />
          </Route>


        </Routes>
      </BrowserRouter>






      {/* <AdminLayout />
    
    <ApplicantDashboard />
    <JobListings /> */}

    </>
  );
}

export default App;
import React from "react";
import { useState } from 'react'
import './App.css'
import ApplicantDashboard from './components/Applicant/ApplicantDashboard'
import JobListings from './components/Applicant/JobListings'
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

// AI Integration
import CandidateRanking from "./components/AI-integration-features/CandidateRanking";



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
          <Route
  path="/"
  element={
    <div className="min-h-screen bg-slate-50 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]">
      
      <div className="container mx-auto px-8 py-12">
        
        <h1 className="text-6xl font-bold text-slate-800 mb-4">
          ATS Development Pages
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Admin */}
          <a
            href="/admin/dashboard"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
              <span className="text-2xl">👨‍💼</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600">
              Admin
            </h2>

            <p className="mt-3 text-slate-500">
              Manage users, jobs, and applications.
            </p>
          </a>

          {/* Applicant */}
          <a
            href="/applicant/dashboard"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
              <span className="text-2xl">👤</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-green-600">
              Applicant
            </h2>

            <p className="mt-3 text-slate-500">
              View jobs, upload resumes and track applications.
            </p>
          </a>

          {/* Recruiter */}
          <a
            href="/recruiter/dashboard"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
              <span className="text-2xl">📋</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-purple-600">
              Recruiter
            </h2>

            <p className="mt-3 text-slate-500">
              Post jobs and manage candidate applications.
            </p>
          </a>

          {/* AI Integration */}
          <a
            href="/candidate-ranking"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-5">
              <span className="text-2xl">🤖</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-pink-600">
              AI Integration
            </h2>

            <p className="mt-3 text-slate-500">
              Candidate ranking and AI-powered recruitment tools.
            </p>
          </a>

        </div>

      </div>
    </div>
  }
/>
          {/* <Route path="/" element={
            <div style={{ padding: "30px" }}>
              <h1>ATS Development Pages</h1>

              <h2><a href="/admin/dashboard">Admin</a></h2>
              <br />

              <h2><a href="/applicant/dashboard">Applicant</a></h2>

              <a href="/applicant/profile"></a>
              <a href="/applicant/jobDetails"></a>
              <a href="/applicant/resumeupload"></a>

              <br />

              <h2><a href="/recruiter/dashboard">Recruiter</a></h2>
              <a href="/recruiter/dashboard"></a>
              <a href="/recruiter/profile"></a>
              <a href="/recruiter/navbar"></a>
              <a href="/recruiter/sidebar"></a>

              <br />

              <h2><a href="/candidate-ranking">AI Integration</a></h2>
              <a href="/candidate-ranking"></a>
            </div>
          } /> */}
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
    
              <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
              <Route path="/applicant/profile" element={<ApplicantProfile />} />
              <Route path="/applicant/jobDetails" element={<JobDetails />} />
              <Route path="/applicant/joblisting" element={<JobListings />} />
              <Route path="/applicant/resumeupload" element={<ResumeUpload />} />

          {/* Recruiter routes */}
          {/* <Route path="/dashboard" element={< RecruiterDashboard/>}> */}
          <Route path="/recruiter" element={<RecruiterDashboard />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterLayout />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="navbar" element={<RecruiterNavbar />} />
            <Route path="sidebar" element={<RecruiterSidebar />} />
          </Route>

          {/* AI-integration */}
          <Route path="/candidate-ranking" element={<CandidateRanking />} />

        </Routes>
      </BrowserRouter>
      

    </>
  );
}

export default App;
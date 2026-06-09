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
import JobsOverview from "./components/Admin/JobsOverview";
import ApplicationsMonitor from "./components/Admin/ApplicationsMonitor";

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
          <Route path="jobs" element={<JobsOverview />} />
<Route path="applications" element={<ApplicationsMonitor />} />
          <Route path="users" element={<AdminUserManagement />} />
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
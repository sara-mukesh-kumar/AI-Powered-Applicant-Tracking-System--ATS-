
import { useState } from 'react'
import './App.css'
import ApplicantDashboard from './components/Applicant/ApplicantDashboard'
// import JobListings from './components/Applicant/JobListings'
import React from "react";
import AdminLayout from "./components/Admin/AdminLayout";

function App() {
  return (
    <AdminLayout />
    // <>
    // <ApplicantDashboard />
    // <JobListings />
    // </>
  );
}

export default App;
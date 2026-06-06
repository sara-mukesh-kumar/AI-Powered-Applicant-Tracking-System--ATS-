import React from 'react'

function applicantdashboard() {
  return (
    <div>applicantdashboard</div>
  )
}

export default applicantdashboard
import React from 'react'

function ApplicantDashboard() {
  return (
    <section className="applicant-dashboard">
      <h1>Applicant Dashboard</h1>
      <p>Welcome back! Review your open applications, latest jobs, and profile status.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Open applications</h2>
          <p>Track submitted applications and next steps.</p>
        </div>
        <div className="card">
          <h2>Latest job matches</h2>
          <p>Browse relevant roles based on your profile.</p>
        </div>
        <div className="card">
          <h2>Profile status</h2>
          <p>Update your resume and contact information.</p>
        </div>
      </div>
    </section>
  )
}

export default ApplicantDashboard
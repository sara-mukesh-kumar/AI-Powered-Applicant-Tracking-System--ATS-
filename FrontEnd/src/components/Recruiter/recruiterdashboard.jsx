import React from "react";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const stats = [
    { title: "Total Jobs Posted", value: 24 },
    { title: "Applications Received", value: 532 },
    { title: "Shortlisted Candidates", value: 87 },
    { title: "Interviews Scheduled", value: 32 },
  ];

  const recentApplicants = [
    {
      name: "John Smith",
      position: "Frontend Developer",
      score: "92%",
      status: "Shortlisted",
    },
    {
      name: "Priya Kumar",
      position: "UI/UX Designer",
      score: "89%",
      status: "Interview",
    },
    {
      name: "Rahul Sharma",
      position: "Backend Developer",
      score: "84%",
      status: "Review",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1>Recruiter Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* AI Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-card">
          <h3>AI Screening Efficiency</h3>
          <h2>95%</h2>
          <p>Applications screened automatically</p>
        </div>

        <div className="analytics-card">
          <h3>Average Match Score</h3>
          <h2>88%</h2>
          <p>Based on resume-job matching</p>
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="applicants-section">
        <h2>Recent Applicants</h2>

        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>AI Match Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentApplicants.map((applicant, index) => (
              <tr key={index}>
                <td>{applicant.name}</td>
                <td>{applicant.position}</td>
                <td>{applicant.score}</td>
                <td>{applicant.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
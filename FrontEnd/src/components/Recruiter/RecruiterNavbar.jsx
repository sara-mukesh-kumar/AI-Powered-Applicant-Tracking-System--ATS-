import React from "react";
// import "./RecruiterNavbar.css";

function RecruiterNavbar() {
  return (
    <nav className="recruiter-navbar">
      <div className="navbar-left">
        <h2>AI ATS</h2>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search candidates, jobs..."
          className="search-box"
        />
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          🔔
        </button>

        <div className="profile-section">
          <img
            src="https://via.placeholder.com/40"
            alt="Recruiter"
            className="profile-image"
          />
          <span>Recruiter</span>
        </div>
      </div>
    </nav>
  );
}

export default RecruiterNavbar;
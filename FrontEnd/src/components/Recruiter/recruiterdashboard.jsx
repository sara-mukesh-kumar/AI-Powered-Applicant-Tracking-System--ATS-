import React, { useState, useEffect } from "react";
import axios from "axios";

function RecruiterDashboard() {
  // --- State for Real Database Data ---
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State for Job Posting Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requiredSkills: "", // We will split this by commas before sending
    experienceLevel: "Entry-Level",
  });

  // Fetch Jobs on Component Mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter jobs to only show ones created by THIS recruiter (optional, but good practice)
      const user = JSON.parse(localStorage.getItem("user"));
      const myJobs = response.data.filter(job => job.recruiterId._id === user._id || job.recruiterId === user._id);
      
      setJobs(myJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Job Form Submission
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Convert comma-separated string to an array: "React, Node" -> ["React", "Node"]
      const skillsArray = jobForm.requiredSkills.split(",").map(skill => skill.trim());

      await axios.post(
        "http://localhost:5000/api/jobs",
        {
          title: jobForm.title,
          description: jobForm.description,
          requiredSkills: skillsArray,
          experienceLevel: jobForm.experienceLevel,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Close modal, reset form, and refresh the job list
      setIsModalOpen(false);
      setJobForm({ title: "", description: "", requiredSkills: "", experienceLevel: "Entry-Level" });
      fetchJobs();
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
      alert(error.response?.data?.message || "Failed to post job");
    }
  };

  // Mixed Data: Real Jobs Count + Mock Data for Applications (until we build the app logic)
  const stats = [
    { title: "Total Jobs Posted", value: jobs.length, icon: "💼", color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Applications Received", value: "0", icon: "📄", color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Shortlisted Candidates", value: "0", icon: "⭐", color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Interviews Scheduled", value: "0", icon: "📅", color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          {/* Added text-slate-900 explicitly to fix global CSS overriding the color */}
          <h1 className="text-3xl font-bold text-slate-900" style={{ color: "#0f172a" }}>Recruiter Dashboard</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your job listings today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>+</span> Post New Job
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{item.title}</p>
              <h2 className="text-3xl font-bold text-slate-900" style={{ color: "#0f172a" }}>
                {isLoading && index === 0 ? "..." : item.value}
              </h2>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Real Active Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-900" style={{ color: "#0f172a" }}>Your Active Jobs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Experience Level</th>
                <th className="px-6 py-4">Required Skills</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-slate-500">Loading jobs...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-slate-500">You haven't posted any jobs yet.</td></tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{job.title}</td>
                    <td className="px-6 py-4">{job.experienceLevel}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- JOB POSTING MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900" style={{ color: "#0f172a" }}>Post a New Job</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 text-2xl font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePostJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Senior React Developer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Describe the role and responsibilities..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({...jobForm, requiredSkills: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Experience Level</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  value={jobForm.experienceLevel}
                  onChange={(e) => setJobForm({...jobForm, experienceLevel: e.target.value})}
                >
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior-Level">Senior-Level</option>
                  <option value="Lead/Manager">Lead/Manager</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
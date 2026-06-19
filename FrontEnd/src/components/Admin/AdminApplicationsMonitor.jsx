import { useState, useEffect } from "react";

const statusBadge = (status) => {
  const lowerStatus = status?.toLowerCase();
  if (lowerStatus === "applied") return "bg-blue-100 text-blue-700 capitalize";
  if (lowerStatus === "interview") return "bg-purple-100 text-purple-700 capitalize";
  if (lowerStatus === "offered") return "bg-green-100 text-green-700 capitalize";
  if (lowerStatus === "rejected") return "bg-red-100 text-red-700 capitalize";
  return "bg-gray-100 text-gray-700 capitalize";
};

const aiScoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const aiScoreBg = (score) => {
  if (score >= 80) return "bg-green-50 border border-green-200";
  if (score >= 60) return "bg-yellow-50 border border-yellow-200";
  return "bg-red-50 border border-red-200";
};

export default function ApplicationsMonitor() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Basic Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- ADVANCED AI FILTERS STATE ---
  const [minAiScore, setMinAiScore] = useState(0); // Range Slider State
  const [skillSearch, setSkillSearch] = useState(""); // Skill Input State
  
  // --- AI MODAL STATE ---
  const [selectedApp, setSelectedApp] = useState(null); // Kis application ka summary khulega

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to fetch applications data.");
      
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application permanently?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/applications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setApplications((prev) => prev.filter((app) => app._id !== id));
        } else {
          alert("Failed to delete application from server.");
        }
      } catch (err) {
        alert("Server error occurred while deleting.");
      }
    }
  };

  // --- ADVANCED SEARCH + AI FILTERS LOGIC ---
  const filteredApps = applications.filter((app) => {
    const applicantName = app.applicantId?.name || "";
    const jobTitle = app.jobId?.title || "";
    const company = app.jobId?.company || "";
    const appStatus = app.status || "Applied";
    const aiScore = app.aiScore || 0;
    
    // Skill array parsing (Database standard check)
    const extractedSkills = app.extractedSkills || []; 

    const matchSearch =
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

    const matchStatus = 
      statusFilter === "all" || appStatus.toLowerCase() === statusFilter.toLowerCase();

    // 1. AI Score Slider Match Condition
    const matchAiScore = aiScore >= minAiScore;

    // 2. AI Extracted Skills Target Substring Match
    const matchSkills = 
      skillSearch.trim() === "" || 
      extractedSkills.some(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()));

    return matchSearch && matchStatus && matchAiScore && matchSkills;
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-medium">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Applications Monitor</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track and monitor all system applications with live AI scores and deep resume parsed insights
        </p>
      </div>

      {/* --- ADVANCED AI FILTER PANEL --- */}
      <div className="bg-white rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Basic Global Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 block">Search Candidate / Job</label>
          <input
            type="text"
            placeholder="🔍 Name, position, company..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 block">Workflow Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* NEW: AI Extracted Skill Target Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-purple-700 flex items-center gap-1">
            🤖 Filter by Extracted Skill
          </label>
          <input
            type="text"
            placeholder="e.g. React, Python, Node..."
            className="w-full border border-purple-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />
        </div>

        {/* NEW: AI Score Ranger Slider Component */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-blue-700">
            <span className="flex items-center gap-1">⚡ Minimum AI Score</span>
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{minAiScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              value={minAiScore}
              onChange={(e) => setMinAiScore(Number(e.target.value))}
            />
            <span className="text-xs text-gray-400">100%</span>
          </div>
        </div>
      </div>

      <div className="text-right text-xs text-gray-500 font-medium px-1">
        Showing {filteredApps.length} of {applications.length} applications
      </div>

      {/* Table Layer */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-[1150px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">AI Match Score</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Insights</th> {/* AI Actions Trigger Header */}
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  No applicant records matched your advanced query criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                        {(app.applicantId?.name || "U").charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{app.applicantId?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-400">{app.applicantId?.email || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {app.jobId?.title || "Deleted Job Position"}
                  </td>

                  <td className="px-6 py-4 text-gray-500">{app.jobId?.company || "N/A"}</td>

                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${aiScoreBg(app.aiScore || 0)}`}>
                      <span>🤖</span>
                      <span className={aiScoreColor(app.aiScore || 0)}>
                        {app.aiScore !== undefined ? `${app.aiScore}%` : "0%"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(app.status)}`}>
                      {app.status || "Applied"}
                    </span>
                  </td>

                  {/* NEW: AI Summary Modal Activator Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="cursor-pointer inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-purple-100 transition"
                    >
                      ✨ View AI Insights
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PREMIUM AI INSIGHTS MODAL COMPONENT --- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 transform scale-100 transition-all">
            
            {/* Modal Head */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>🤖</span> AI Evaluation Summary
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Applicant: <span className="font-semibold">{selectedApp.applicantId?.name || "Candidate"}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="mt-4 space-y-4">
              {/* Match Score Indicator Row */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-sm font-medium text-gray-700">Calculated Job Suitability:</span>
                <span className={`px-3 py-1 rounded-full font-extrabold text-sm ${aiScoreBg(selectedApp.aiScore || 0)} ${aiScoreColor(selectedApp.aiScore || 0)}`}>
                  {selectedApp.aiScore || 0}% Match
                </span>
              </div>

              {/* Extracted Skills List Layout */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">AI Extracted Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.extractedSkills && selectedApp.extractedSkills.length > 0 ? (
                    selectedApp.extractedSkills.map((skill, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No explicit skill parameters parsed from document.</span>
                  )}
                </div>
              </div>

              {/* Core Context AI Summary Block */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fitment Analysis Summary:</h4>
                <div className="bg-purple-50/50 border border-purple-100/70 rounded-xl p-3.5 text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedApp.aiSummary || "AI Parsing engine results for this record will generate automatically once the candidate's core document pipeline completes execution."}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedApp(null)}
                className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition shadow"
              >
                Close Insights
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
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
  const [minAiScore, setMinAiScore] = useState(0); 
  const [skillSearch, setSkillSearch] = useState(""); 
  
  // --- AI MODAL STATE ---
  const [selectedApp, setSelectedApp] = useState(null); 

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

  // --- ADVANCED SEARCH + AI FILTERS LOGIC (Nested aiAnalysis fixed) ---
  const filteredApps = applications.filter((app) => {
    const applicantName = app.applicantId?.name || "";
    const jobTitle = app.jobId?.title || "";
    const company = app.jobId?.company || "";
    const appStatus = app.status || "Applied";
    
    // Fixed Object Path Destructuring matching teammate schema layout
    const aiScore = app.aiAnalysis?.aiScore !== undefined ? app.aiAnalysis.aiScore : (app.aiScore || 0);
    const extractedSkills = app.aiAnalysis?.extractedSkills || app.extractedSkills || []; 

    const matchSearch =
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

    const matchStatus = 
      statusFilter === "all" || appStatus.toLowerCase() === statusFilter.toLowerCase();

    const matchAiScore = aiScore >= minAiScore;

    const matchSkills = 
      skillSearch.trim() === "" || 
      extractedSkills.some(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()));

    return matchSearch && matchStatus && matchAiScore && matchSkills;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-base sm:text-lg font-medium">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Applications Monitor</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Track and monitor all system applications with live AI scores and deep resume parsed insights
        </p>
      </div>

      {/* --- RESPONSIVE ADVANCED AI FILTER PANEL --- */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Basic Global Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 block">Search Candidate / Job</label>
          <input
            type="text"
            placeholder="🔍 Name, position, company..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 block">Workflow Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
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

        {/* AI Extracted Skill Target Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-purple-700 flex items-center gap-1">
            <span>🤖</span> Filter by Extracted Skill
          </label>
          <input
            type="text"
            placeholder="e.g. React, Python, Node..."
            className="w-full border border-purple-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />
        </div>

        {/* AI Score Ranger Slider Component */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-blue-700">
            <span className="flex items-center gap-1">⚡ Minimum AI Score</span>
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">{minAiScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer flex-1"
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

      {/* Table Layer Isolated Container */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow w-full border border-gray-100">
        <table className="min-w-[1150px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">AI Match Score</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Insights</th> 
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400 font-medium italic">
                  No applicant records matched your advanced query criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const currentAiScore = app.aiAnalysis?.aiScore !== undefined ? app.aiAnalysis.aiScore : (app.aiScore || 0);
                return (
                  <tr key={app._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-purple-200">
                          {(app.applicantId?.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 truncate max-w-[150px]">{app.applicantId?.name || "Unknown User"}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{app.applicantId?.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-700 truncate max-w-[180px]">
                      {app.jobId?.title || "Deleted Position"}
                    </td>

                    <td className="px-6 py-4 text-gray-500 truncate max-w-[140px] font-medium">{app.jobId?.company || "N/A"}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${aiScoreBg(currentAiScore)}`}>
                        <span>🤖</span>
                        <span className={aiScoreColor(currentAiScore)}>
                          {currentAiScore}%
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-200 ${statusBadge(app.status)}`}>
                        {app.status || "Applied"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="cursor-pointer inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/60 px-3 py-1 rounded-xl text-xs font-bold hover:bg-purple-100 transition shadow-sm"
                      >
                        ✨ View AI Insights
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="cursor-pointer bg-red-500 text-white font-bold px-3 py-1 rounded-xl text-xs hover:bg-red-600 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- RESPONSIVE PREMIUM GLASSMORPHIC AI INSIGHTS MODAL --- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md sm:max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[85vh] overflow-y-auto scrollbar-thin">
            
            {/* Modal Head */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  <span>🤖</span> AI Evaluation Summary
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Candidate Profile: <span className="font-bold text-gray-800">{selectedApp.applicantId?.name || "Candidate"}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer p-1 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="mt-5 space-y-4">
              {/* Match Score Indicator Row */}
              {(() => {
                const currentAiScore = selectedApp.aiAnalysis?.aiScore !== undefined ? selectedApp.aiAnalysis.aiScore : (selectedApp.aiScore || 0);
                const currentSkills = selectedApp.aiAnalysis?.extractedSkills || selectedApp.extractedSkills || [];
                const currentSummary = selectedApp.aiAnalysis?.aiSummary || selectedApp.aiSummary || "";

                return (
                  <>
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3.5 border border-gray-100 text-xs sm:text-sm">
                      <span className="font-bold text-gray-700">AI Recruiter Assessment Fitment:</span>
                      <span className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm ${aiScoreBg(currentAiScore)} ${aiScoreColor(currentAiScore)}`}>
                        {currentAiScore}% Core Match
                      </span>
                    </div>

                    {/* Extracted Skills List Layout */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider">AI Parsed Skill Badges:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentSkills.length > 0 ? (
                          currentSkills.map((skill, index) => (
                            <span key={index} className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">No explicit skill parameters parsed from document.</span>
                        )}
                      </div>
                    </div>

                    {/* Core Context AI Summary Block */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider">Analysis Matrix Insight:</h4>
                      <div className="bg-purple-50/40 border border-purple-100/60 rounded-2xl p-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-h-44 overflow-y-auto scrollbar-thin">
                        {currentSummary || "AI Parsing engine summary results will populate automatically once resume processing completes execution."}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedApp(null)}
                className="cursor-pointer bg-gray-9alive bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition w-full sm:w-auto shadow-md"
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
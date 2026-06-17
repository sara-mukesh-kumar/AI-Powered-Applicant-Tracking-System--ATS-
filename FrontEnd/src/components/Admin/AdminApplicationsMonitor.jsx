import { useState, useEffect } from "react";

// Status Badge Colors Matching Backend Enum Case
const statusBadge = (status) => {
  const lowerStatus = status?.toLowerCase();
  if (lowerStatus === "applied") return "bg-blue-100 text-blue-700 capitalize";
  if (lowerStatus === "interview") return "bg-purple-100 text-purple-700 capitalize";
  if (lowerStatus === "offered") return "bg-green-100 text-green-700 capitalize";
  if (lowerStatus === "rejected") return "bg-red-100 text-red-700 capitalize";
  return "bg-gray-100 text-gray-700 capitalize";
};

const aiScoreColor = (score) => {
  if (!score && score !== 0) return "text-gray-500";
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const aiScoreBg = (score) => {
  if (!score && score !== 0) return "bg-gray-50 border border-gray-200";
  if (score >= 80) return "bg-green-50 border border-green-200";
  if (score >= 60) return "bg-yellow-50 border border-yellow-200";
  return "bg-red-50 border border-red-200";
};

export default function ApplicationsMonitor() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // 🤖 Week 3 State Hook for managing current selected AI report popups
  const [selectedAIReport, setSelectedAIReport] = useState(null);

  // Fetch data from real backend api synced with system query filtering
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Server query execution mapping matching user dashboard requests
      const res = await fetch(`/api/admin/applications?score=${scoreFilter}&status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch applications data.");
      }
      
      const data = await res.json();
      setApplications(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, scoreFilter]); // Auto re-trigger when selects drop down data update

  // Delete Handler connected to database
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application permanently from the system?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/applications/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // Remove from local array state immediately
          setApplications((prev) => prev.filter((app) => app._id !== id));
        } else {
          alert("Failed to delete application from server.");
        }
      } catch (err) {
        console.error("Error during deletion:", err);
        alert("Server error occurred while deleting.");
      }
    }
  };

  // Search + Filter Client Logic for instant matches
  const filteredApps = applications.filter((app) => {
    const applicantName = app.applicantId?.name || "";
    const jobTitle = app.jobId?.title || "";
    const company = app.jobId?.company || "";

    return (
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Syncing system applications data pipelines...</div>;
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
          Track and monitor all system applications with live AI scores
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status?.toLowerCase() === "applied").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Applied</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">
            {applications.filter((a) => a.status?.toLowerCase() === "interview").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Interview</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status?.toLowerCase() === "offered").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Offered</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-red-600">
            {applications.filter((a) => a.status?.toLowerCase() === "rejected").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Rejected</p>
        </div>
      </div>

      {/* Filters Form Controller Layout */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-center border border-gray-100">
        <input
          type="text"
          placeholder="🔍 Search by name, job, company..."
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex-1 min-w-48 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
        >
          <option value="all">All AI Scores</option>
          <option value="high">High Match (80+)</option>
          <option value="medium">Medium Match (60-79)</option>
          <option value="low">Low Match (Below 60)</option>
        </select>
        <span className="text-sm text-gray-400 font-medium ml-auto">
          Showing {filteredApps.length} of {applications.length} applications
        </span>
      </div>

      {/* Table Structure Rendering */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow border border-gray-100">
        <table className="min-w-[1100px] w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">AI Tracking Metrics</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Applied On</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400 font-medium">
                  No tracking data matched current dashboard metrics.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                // Safely evaluate potential default properties injected from teammate schemas
                const score = app.aiAnalysis?.aiScore !== undefined ? app.aiAnalysis.aiScore : (app.aiScore || 0);
                const isProcessed = app.aiAnalysis?.isProcessed || (app.aiScore !== undefined);

                return (
                  <tr key={app._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Applicant Profile Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs uppercase shadow-xs">
                          {(app.applicantId?.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.applicantId?.name || "Deleted Account"}</p>
                          <p className="text-xs text-gray-400">{app.applicantId?.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {app.jobId?.title || "Archived Job Vacancy"}
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 font-medium text-gray-500">{app.jobId?.company || "External"}</td>

                    {/* AI Scoring Module Block */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wide ${aiScoreBg(score)}`}>
                          <span>🤖</span>
                          <span className={aiScoreColor(score)}>{score}%</span>
                        </div>
                        {isProcessed ? (
                          <button
                            onClick={() => setSelectedAIReport(app.aiAnalysis || { aiScore: score, aiSummary: "No detailed analysis log reported.", missingKeywords: [], extractedSkills: [] })}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold underline cursor-pointer mt-0.5 select-none"
                          >
                            View Summary Report
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic mt-0.5">Awaiting file parsing...</span>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(app.status)}`}>
                        {app.status || "Applied"}
                      </span>
                    </td>

                    {/* Submission Timestamps */}
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                    </td>

                    {/* Log Cleanup Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="cursor-pointer bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        Delete Log
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🤖 IMMERSIVE AI INFRASTRUCTURE POPUP MODAL COMPONENT */}
      {selectedAIReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative border border-gray-100 flex flex-col max-h-[85vh] animate-slide-up">
            
            {/* Modal Head */}
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">🤖 AI Candidate Evaluation Report</h3>
              <p className="text-xs text-gray-400 mt-0.5">Semantic evaluation summary processed from applicant's parsed resume text.</p>
            </div>

            {/* Modal Body Container with customized scrollable list block */}
            <div className="space-y-5 overflow-y-auto flex-1 pr-1.5 scrollbar-thin">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calculated Match Score</span>
                <div className="text-3xl font-black text-gray-900 mt-0.5">{selectedAIReport.aiScore || 0}%</div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Executive Summary</span>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 font-medium">
                  {selectedAIReport.aiSummary || "System LLM engine evaluated the profile successfully but summary details were not logged."}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Missing Keywords / Recommendations</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAIReport.missingKeywords?.length > 0 ? (
                    selectedAIReport.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="bg-red-50 text-red-600 border border-red-100 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl">
                      ✔ Profile perfectly covers all critical job description requirements!
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Extracted Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAIReport.extractedSkills?.length > 0 ? (
                    selectedAIReport.extractedSkills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No technology tags directly parsed from file content.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedAIReport(null)}
                className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-800 active:scale-98 transition-all shadow-xs cursor-pointer"
              >
                Close Metrics Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
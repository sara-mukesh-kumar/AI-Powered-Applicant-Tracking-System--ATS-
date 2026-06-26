import { useState, useEffect } from "react";

export default function ApplicationsMonitor() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Control Engine Filtering States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);

  // Focus Drawer Target State
  const [activeDrawerApp, setActiveDrawerApp] = useState(null);

  useEffect(() => {
    fetchApplicationsPipeline();
  }, [statusFilter]); // Reload query when absolute status constraints shift

  const fetchApplicationsPipeline = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Dynamic query assembler targeting backend routes parameters mapping
      let url = `/api/admin/applications?status=${statusFilter}`;
      if (minScore > 0) {
        url += `&scoreMin=${minScore}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.ok) {
        setApplications(data);
      } else {
        setError(data.message || "Failed to synchronise candidate streaming logs");
      }
    } catch (err) {
      setError("Data pipeline transmission breakdown.");
    } finally {
      setLoading(false);
    }
  };

  // Safe Client-side text verification stream mapping
  const sortedAndFilteredPool = applications.filter((app) => {
    const candidateName = app.applicantId?.name?.toLowerCase() || "";
    const jobTitle = app.jobId?.title?.toLowerCase() || "";
    const matchText = candidateName.includes(search.toLowerCase()) || jobTitle.includes(search.toLowerCase());
    
    // Fallback protection filter check against dynamic range tracking
    const currentScore = app.aiAnalysis?.aiScore ?? app.aiScore ?? 0;
    return matchText && currentScore >= minScore;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative min-h-screen">
      {/* Module Description Matrix */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Screening & Application Pipeline</h1>
        <p className="text-sm text-gray-500">Audit system-wide parsed metrics, range vectors, and real-time data queues.</p>
      </div>

      {/* Control Filters Hub */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Text Field Query Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">Search Identity</label>
          <input
            type="text"
            placeholder="Search candidate name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Pipeline Stage State Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">Pipeline Track Stage</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            <option value="all">All Submissions</option>
            <option value="applied">Applied / New Entry</option>
            <option value="shortlisted">Shortlisted Logs</option>
            <option value="rejected">Rejected Index</option>
          </select>
        </div>

        {/* AI Vector Threshold range slider slider controller */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase">Min AI Engine Threshold</label>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{minScore}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>
      )}

      {/* Main Table Flow Visual Grid Layout */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Candidate Identity</th>
                <th className="p-4">Applied Position</th>
                <th className="p-4">AI Structural Evaluation</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">Streaming structural data array...</td>
                </tr>
              ) : sortedAndFilteredPool.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No submission documents inside current data bounds indices.</td>
                </tr>
              ) : (
                sortedAndFilteredPool.map((app) => {
                  const score = app.aiAnalysis?.aiScore ?? app.aiScore ?? 0;
                  return (
                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{app.applicantId?.name || "Candidate Node"}</div>
                        <div className="text-xs text-gray-400">{app.applicantId?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{app.jobId?.title || "System Registry Missing"}</div>
                        <div className="text-xs text-gray-400">{app.jobId?.company}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                            score >= 80 ? "text-emerald-700 bg-emerald-50" : 
                            score >= 60 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"
                          }`}>
                            {score} Match Score
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                          app.status === "shortlisted" ? "bg-emerald-50 text-emerald-700" :
                          app.status === "rejected" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setActiveDrawerApp(app)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          View Analysis Drawer
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Insights Analysis Details Drawer Component */}
      {activeDrawerApp && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-300">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-in border-l border-gray-100">
            <div className="space-y-6">
              {/* Drawer Top Header info wrapper */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{activeDrawerApp.applicantId?.name || "Candidate Dossier"}</h3>
                  <p className="text-xs text-gray-400">Internal Registry Node ID: {activeDrawerApp._id}</p>
                </div>
                <button
                  onClick={() => setActiveDrawerApp(null)}
                  className="text-gray-400 hover:text-gray-600 font-medium p-1 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              {/* Core Analytics Scoring Index Metric */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-center space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calculated Match Vector</div>
                <div className="text-4xl font-extrabold text-blue-600 tracking-tight">
                  {activeDrawerApp.aiAnalysis?.aiScore ?? activeDrawerApp.aiScore ?? 0}%
                </div>
                <p className="text-xs text-gray-500">Synthesized parsing engine matching cross check matrix log rules.</p>
              </div>

              {/* Tagging Arrays Display Section Tokens block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identified Domain Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDrawerApp.aiAnalysis?.parsedSkills?.length > 0 ? (
                    activeDrawerApp.aiAnalysis.parsedSkills.map((skill, index) => (
                      <span key={index} className="bg-blue-50/80 text-blue-700 border border-blue-100/50 px-2.5 py-1 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No exact indexing token matches detected inside document.</span>
                  )}
                </div>
              </div>

              {/* Text Assessment Explainability Blocks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Extraction Summarized Text</h4>
                <blockquote className="bg-amber-50/40 text-amber-900 border-l-4 border-amber-400 p-3 rounded-r-lg text-xs leading-relaxed italic">
                  {activeDrawerApp.aiAnalysis?.explanation || "No deep processing explanation logs generated inside active database model instance."}
                </blockquote>
              </div>
            </div>

            {/* Bottom Panel Container Actions Close */}
            <div className="border-t border-gray-100 pt-4 mt-8">
              <button
                onClick={() => setActiveDrawerApp(null)}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium py-2.5 rounded-xl transition-all"
              >
                Done Auditing Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
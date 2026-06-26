import { useState, useEffect } from "react";

export default function JobsOverview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchJobsStream();
  }, []);

  const fetchJobsStream = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(data);
      } else {
        setError(data.message || "Failed to sync system jobs stack");
      }
    } catch (err) {
      setError("Network pipeline exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Archive / Toggle deployment status handler
  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "archived" : "active";
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setJobs(jobs.map(j => j._id === jobId ? { ...j, status: nextStatus } : j));
      }
    } catch (err) {
      console.error("Pipeline failure on status alteration", err);
    }
  };

  // Delete matching unique listing signature
  const handleDeletePositionRecord = async (jobId) => {
    if (!window.confirm("Are you sure you want to permanently purge this job position?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs(jobs.filter(j => j._id !== jobId));
      }
    } catch (err) {
      console.error("Purge failure execution route", err);
    }
  };

  // Client side compute filtering logic
  const filteredJobsList = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? job.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Upper Module Panel Section Description */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Open Positions Control</h1>
        <p className="text-sm text-gray-500">Monitor active openings, modify status state trackers, and audit structural records.</p>
      </div>

      {/* Advanced Control Filters block */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by position or business label..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        >
          <option value="">All Deployments</option>
          <option value="active">Active Listing</option>
          <option value="archived">Archived Log</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">{error}</div>
      )}

      {/* Data Visual Table Layout */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Position Details</th>
                <th className="p-4">Authorized Recruiter</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 text-right">Registry Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">Pulling system collections repository records...</td>
                </tr>
              ) : filteredJobsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No structured employment nodes found.</td>
                </tr>
              ) : (
                filteredJobsList.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-400">{job.company || "Company Log"} — {job.location || "Remote Node"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-800 font-medium">{job.recruiterId?.name || "System Automated"}</div>
                      <div className="text-xs text-gray-400">{job.recruiterId?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        job.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === "active" ? "bg-emerald-600" : "bg-gray-400"}`} />
                        {job.status === "active" ? "Active Open" : "Archived Block"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleJobStatus(job._id, job.status)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                          job.status === "active"
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                      >
                        {job.status === "active" ? "Archive Listing" : "Deploy Active"}
                      </button>
                      <button
                        onClick={() => handleDeletePositionRecord(job._id)}
                        className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Purge Entry
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
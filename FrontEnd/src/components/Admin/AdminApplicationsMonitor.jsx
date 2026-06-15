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

  // Fetch data from real backend api
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/applications", {
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
  }, []);

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

  // Search + Filter Logic matching backend structure
  const filteredApps = applications.filter((app) => {
    const applicantName = app.applicantId?.name || "";
    const jobTitle = app.jobId?.title || "";
    const company = app.jobId?.company || "";
    const appStatus = app.status || "Applied";
    const aiScore = app.aiScore || 0;

    const matchSearch =
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

    const matchStatus = 
      statusFilter === "all" || 
      appStatus.toLowerCase() === statusFilter.toLowerCase();

    const matchScore =
      scoreFilter === "all" ||
      (scoreFilter === "high" && aiScore >= 80) ||
      (scoreFilter === "medium" && aiScore >= 60 && aiScore < 80) ||
      (scoreFilter === "low" && aiScore < 60);

    return matchSearch && matchStatus && matchScore;
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
          Track and monitor all system applications with live AI scores
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status?.toLowerCase() === "applied").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Applied</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {applications.filter((a) => a.status?.toLowerCase() === "interview").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Interview</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status?.toLowerCase() === "offered").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Offered</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {applications.filter((a) => a.status?.toLowerCase() === "rejected").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search by name, job, company..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
        >
          <option value="all">All AI Scores</option>
          <option value="high">High (80+)</option>
          <option value="medium">Medium (60-79)</option>
          <option value="low">Low (below 60)</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredApps.length} of {applications.length} applications
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">AI Score</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Applied On</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  No applications found in the system.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition">
                  {/* Applicant Info populated from User */}
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

                  {/* Job Title populated from Job */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {app.jobId?.title || "Deleted Job Position"}
                  </td>

                  {/* Company populated from Job */}
                  <td className="px-6 py-4 text-gray-500">{app.jobId?.company || "N/A"}</td>

                  {/* AI Score */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${aiScoreBg(app.aiScore)}`}>
                      <span>🤖</span>
                      <span className={aiScoreColor(app.aiScore)}>
                        {app.aiScore !== undefined ? `${app.aiScore}%` : "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(app.status)}`}>
                      {app.status || "Applied"}
                    </span>
                  </td>

                  {/* Applied On - Formatted Date */}
                  <td className="px-6 py-4 text-gray-500">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                  </td>

                  {/* Actions */}
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
    </div>
  );
}
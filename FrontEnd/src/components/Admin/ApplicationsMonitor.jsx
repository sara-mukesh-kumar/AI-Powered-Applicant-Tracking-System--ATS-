import { useState } from "react";

const fakeApplications = [
  { _id: "1", applicantName: "Ahmed Raza", email: "ahmed@gmail.com", jobTitle: "Frontend Developer", company: "TechCorp", status: "applied", aiScore: 87, appliedAt: "2026-05-01" },
  { _id: "2", applicantName: "Fatima Malik", email: "fatima@gmail.com", jobTitle: "Backend Engineer", company: "SoftHouse", status: "interview", aiScore: 92, appliedAt: "2026-05-03" },
  { _id: "3", applicantName: "Zara Ahmed", email: "zara@gmail.com", jobTitle: "UI/UX Designer", company: "CreativeLab", status: "offered", aiScore: 78, appliedAt: "2026-05-05" },
  { _id: "4", applicantName: "Hassan Ali", email: "hassan@gmail.com", jobTitle: "React Native Dev", company: "AppStudio", status: "rejected", aiScore: 45, appliedAt: "2026-05-07" },
  { _id: "5", applicantName: "Sana Tariq", email: "sana@gmail.com", jobTitle: "DevOps Engineer", company: "CloudTech", status: "applied", aiScore: 65, appliedAt: "2026-05-10" },
  { _id: "6", applicantName: "Bilal Khan", email: "bilal@gmail.com", jobTitle: "Data Scientist", company: "AI Solutions", status: "interview", aiScore: 95, appliedAt: "2026-05-12" },
];

const statusBadge = (status) => {
  if (status === "applied") return "bg-blue-100 text-blue-700";
  if (status === "interview") return "bg-purple-100 text-purple-700";
  if (status === "offered") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
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
  const [applications, setApplications] = useState(fakeApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Search + Filter Logic
  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const matchScore =
      scoreFilter === "all" ||
      (scoreFilter === "high" && app.aiScore >= 80) ||
      (scoreFilter === "medium" && app.aiScore >= 60 && app.aiScore < 80) ||
      (scoreFilter === "low" && app.aiScore < 60);
    return matchSearch && matchStatus && matchScore;
  });

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications((prev) => prev.filter((app) => app._id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Applications Monitor</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track and monitor all applications with AI scores
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status === "applied").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Applied</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {applications.filter((a) => a.status === "interview").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Interview</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "offered").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Offered</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {applications.filter((a) => a.status === "rejected").length}
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
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
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
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition">

                  {/* Applicant */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{app.applicantName}</p>
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Job Title */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {app.jobTitle}
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 text-gray-500">{app.company}</td>

                  {/* AI Score */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${aiScoreBg(app.aiScore)}`}>
                      <span>🤖</span>
                      <span className={aiScoreColor(app.aiScore)}>
                        {app.aiScore}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>

                  {/* Applied On */}
                  <td className="px-6 py-4 text-gray-500">{app.appliedAt}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
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
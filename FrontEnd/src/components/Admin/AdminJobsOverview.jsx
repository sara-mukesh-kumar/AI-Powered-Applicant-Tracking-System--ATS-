import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const statusBadge = (status) => {
  if (status === "open") return "bg-green-100 text-green-700 capitalize";
  if (status === "archived") return "bg-yellow-100 text-yellow-700 capitalize";
  if (status === "closed") return "bg-red-100 text-red-700 capitalize";
  return "bg-gray-100 text-gray-700 capitalize";
};

export default function AdminJobsOverview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/admin/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError("Jobs load nahi ho sake");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, navigate]);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      (job.recruiterId?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || job.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleArchive = async (id) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "archived" }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((job) => job._id === id ? { ...job, status: "archived" } : job)
        );
      }
    } catch (err) {
      setError("Archive nahi ho saka");
    }
  };

  const handleReactivate = async (id) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "open" }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((job) => job._id === id ? { ...job, status: "open" } : job)
        );
      }
    } catch (err) {
      setError("Reactivate nahi ho saka");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting permanently?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (err) {
      setError("Job delete nahi ho saki");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-base sm:text-lg font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Responsive Header View */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Jobs Overview</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Monitor and manage all job postings across the system</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Stats Cards Responsive System */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {jobs.filter((j) => j.status === "open").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Active Jobs</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {jobs.filter((j) => j.status === "archived").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Archived Jobs</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {jobs.filter((j) => j.status === "closed").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Closed Jobs</p>
        </div>
      </div>

      {/* Filters Stack Mobile Responsive Flow */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <input
          type="text"
          placeholder="🔍 Search by title or recruiter..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Active</option>
          <option value="archived">Archived</option>
          <option value="closed">Closed</option>
        </select>
        <span className="text-xs sm:text-sm text-gray-500 text-center md:ml-auto">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </span>
      </div>

      {/* Table Area Isolated Scroll Block */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow w-full">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Posted By</th>
              <th className="px-6 py-4 text-left">Skills</th>
              <th className="px-6 py-4 text-left">Experience</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Uploaded On</th>
              <th className="px-6 py-4 text-left">Expiry Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400">
                  No jobs found in the system database.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800 truncate max-w-[180px] sm:max-w-none">{job.title}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[150px] sm:max-w-none">
                    {job.recruiterId?.name || "Unknown Recruiter"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {(job.requiredSkills || []).slice(0, 2).map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                      {(job.requiredSkills || []).length > 2 && (
                        <span className="text-gray-400 text-xs px-1 flex items-center whitespace-nowrap">
                          +{job.requiredSkills.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{job.experienceLevel || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-amber-700 whitespace-nowrap">
                    {job.expiryDate 
                      ? new Date(job.expiryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : job.deadline 
                        ? new Date(job.deadline).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) 
                        : "No Deadline"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {job.status === "open" && (
                        <button
                          onClick={() => handleArchive(job._id)}
                          className="cursor-pointer bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition shadow-sm"
                        >
                          Archive
                        </button>
                      )}
                      {job.status === "archived" && (
                        <button
                          onClick={() => handleReactivate(job._id)}
                          className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition shadow-sm"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
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
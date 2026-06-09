import { useState } from "react";

const fakeJobs = [
  { _id: "1", title: "Frontend Developer", company: "TechCorp", location: "Lahore", status: "active", applications: 23, postedBy: "Ali Hassan", createdAt: "2026-01-10" },
  { _id: "2", title: "Backend Engineer", company: "SoftHouse", location: "Karachi", status: "active", applications: 45, postedBy: "Sara Khan", createdAt: "2026-02-15" },
  { _id: "3", title: "UI/UX Designer", company: "CreativeLab", location: "Islamabad", status: "archived", applications: 12, postedBy: "Ahmed Raza", createdAt: "2026-02-28" },
  { _id: "4", title: "React Native Dev", company: "AppStudio", location: "Lahore", status: "active", applications: 34, postedBy: "Fatima Malik", createdAt: "2026-03-05" },
  { _id: "5", title: "DevOps Engineer", company: "CloudTech", location: "Karachi", status: "closed", applications: 8, postedBy: "Usman Tariq", createdAt: "2026-03-20" },
  { _id: "6", title: "Data Scientist", company: "AI Solutions", location: "Islamabad", status: "active", applications: 56, postedBy: "Zara Ahmed", createdAt: "2026-04-01" },
];

const statusBadge = (status) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "archived") return "bg-yellow-100 text-yellow-700";
  if (status === "closed") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function JobsOverview() {
  const [jobs, setJobs] = useState(fakeJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Search + Filter
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || job.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Archive Handler
  const handleArchive = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job._id === id ? { ...job, status: "archived" } : job
      )
    );
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs((prev) => prev.filter((job) => job._id !== id));
    }
  };

  // Reactivate Handler
  const handleReactivate = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job._id === id ? { ...job, status: "active" } : job
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Jobs Overview</h2>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and manage all job postings
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {jobs.filter((j) => j.status === "active").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Active Jobs</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {jobs.filter((j) => j.status === "archived").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Archived Jobs</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {jobs.filter((j) => j.status === "closed").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Closed Jobs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search by title, company, location..."
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
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="closed">Closed</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Applications</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Posted By</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400">
                  No jobs found
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition">

                  {/* Title */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {job.title}
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 text-gray-600">{job.company}</td>

                  {/* Location */}
                  <td className="px-6 py-4 text-gray-500">📍 {job.location}</td>

                  {/* Applications Count */}
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {job.applications} apps
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>

                  {/* Posted By */}
                  <td className="px-6 py-4 text-gray-500">{job.postedBy}</td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500">{job.createdAt}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {job.status === "active" && (
                        <button
                          onClick={() => handleArchive(job._id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition"
                        >
                          Archive
                        </button>
                      )}
                      {job.status === "archived" && (
                        <button
                          onClick={() => handleReactivate(job._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
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
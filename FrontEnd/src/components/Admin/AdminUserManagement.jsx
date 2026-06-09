import { useState } from "react";

// Fake data — backend banne tak
const fakeUsers = [
  { _id: "1", name: "Ali Hassan", email: "ali@gmail.com", role: "recruiter", status: "active", createdAt: "2026-01-15" },
  { _id: "2", name: "Sara Khan", email: "sara@gmail.com", role: "recruiter", status: "pending", createdAt: "2026-02-20" },
  { _id: "3", name: "Ahmed Raza", email: "ahmed@gmail.com", role: "applicant", status: "active", createdAt: "2026-03-10" },
  { _id: "4", name: "Fatima Malik", email: "fatima@gmail.com", role: "applicant", status: "active", createdAt: "2026-03-22" },
  { _id: "5", name: "Usman Tariq", email: "usman@gmail.com", role: "recruiter", status: "suspended", createdAt: "2026-04-05" },
  { _id: "6", name: "Zara Ahmed", email: "zara@gmail.com", role: "applicant", status: "active", createdAt: "2026-04-18" },
];

const roleBadge = (role) => {
  if (role === "recruiter") return "bg-purple-100 text-purple-700";
  if (role === "applicant") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

const statusBadge = (status) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "suspended") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function UserManagement() {
  const [users, setUsers] = useState(fakeUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Search + Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchStatus = statusFilter === "all" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Status Change Handler
  const handleStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user._id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage all recruiters and applicants
        </p>
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Role Filter */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="recruiter">Recruiter</option>
          <option value="applicant">Applicant</option>
        </select>

        {/* Status Filter */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* Total Count */}
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Joined</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">

                  {/* Name */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-gray-500">{user.createdAt}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      {/* Approve Button — sirf pending ke liye */}
                      {user.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "active")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                      )}

                      {/* Suspend Button — sirf active ke liye */}
                      {user.status === "active" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "suspended")}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition"
                        >
                          Suspend
                        </button>
                      )}

                      {/* Reactivate — sirf suspended ke liye */}
                      {user.status === "suspended" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "active")}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                        >
                          Reactivate
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(user._id)}
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
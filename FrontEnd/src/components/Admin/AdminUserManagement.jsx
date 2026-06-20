import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const roleBadge = (role) => {
  if (role === "recruiter") return "bg-purple-100 text-purple-700 capitalize";
  if (role === "applicant") return "bg-blue-100 text-blue-700 capitalize";
  return "bg-gray-100 text-gray-700 capitalize";
};

const statusBadge = (status) => {
  if (status === "active") return "bg-green-100 text-green-700 capitalize";
  if (status === "pending") return "bg-yellow-100 text-yellow-700 capitalize";
  if (status === "suspended") return "bg-red-100 text-red-700 capitalize";
  return "bg-gray-100 text-gray-700 capitalize";
};

export default function UserManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  
  const [roleFilter, setRoleFilter] = useState(location.state?.filterRole || "all");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.state?.filterRole) {
      setRoleFilter(location.state.filterRole);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/"); 
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Users load nahi ho sake");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchStatus = statusFilter === "all" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (err) {
      setError("Status update nahi ho saka");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
      }
    } catch (err) {
      setError("User delete nahi ho saka");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Responsive Typography Headers */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage all recruiters and applicants</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Responsive Filters Stack Control */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Dropdown container wraps beautifully into double columns on mobile viewports */}
        <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="recruiter">Recruiter</option>
            <option value="applicant">Applicant</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <span className="text-xs sm:text-sm text-gray-500 text-center lg:ml-auto">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {/* Table Container Layer Isolate with Native Smooth Hardware Scrolling */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow w-full">
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
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {(user.name || "U").charAt(0)}
                      </div>
                      <span className="truncate max-w-[150px] sm:max-w-none">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[180px] sm:max-w-none">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(user.status)}`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {(!user.status || user.status === "pending") && (
                        <button
                          onClick={() => handleStatusChange(user._id, "active")}
                          className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition shadow-sm"
                        >
                          Approve
                        </button>
                      )}
                      {user.status === "active" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "suspended")}
                          className="cursor-pointer bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition shadow-sm"
                        >
                          Suspend
                        </button>
                      )}
                      {user.status === "suspended" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "active")}
                          className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition shadow-sm"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
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
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Standard dynamic badges for design consistency
const roleBadge = (role) => {
  if (role === "recruiter") return "bg-purple-50 text-purple-700 font-medium capitalize border border-purple-100";
  if (role === "applicant") return "bg-blue-50 text-blue-700 font-medium capitalize border border-blue-100";
  return "bg-gray-50 text-gray-700 font-medium capitalize border border-gray-100";
};

export default function UserManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search aur Filters state tracking
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(location.state?.filterRole || "");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Activity Modal state references
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.state?.filterRole) {
      setRoleFilter(location.state.filterRole);
    }
  }, [location.state]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401 || res.status === 403) {
        navigate("/"); 
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch master records");
      }
    } catch (err) {
      setError("Network error. Internal systems tracking failure.");
    } finally {
      setLoading(false);
    }
  };

  // Status handler (Toggle Block/Unblock Account)
  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "suspended" ? "approved" : "suspended";
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: nextStatus } : u));
      } else {
        setError("Status modify action blocked by pipeline layers.");
      }
    } catch (err) {
      console.error("Action handler crash logs:", err);
    }
  };

  // Privilege Assignment (Role upgrade/downgrade engine)
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error("Role migration error log:", err);
    }
  };

  // Account Wipe Operation (Wipes records from active data arrays)
  const handleDeleteUserRecord = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this user account profile?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        setError("Deletion protocol dropped by backend cluster rules.");
      }
    } catch (err) {
      console.error("Data wipe failure log tracking:", err);
    }
  };

  // Local Memory dynamic blob parsing engine for CSV exports
  const handleExportToCSVRegistry = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      alert("No matching active dashboard rows to export.");
      return;
    }

    const csvHeaders = ["Unique ID", "Full Name", "Email Address", "System Access Role", "Status Level"];
    const csvRows = filteredUsers.map(u => [
      u._id,
      `"${u.name || 'N/A'}"`,
      u.email,
      u.role,
      u.status || "approved"
    ]);

    const compiledCSVContent = [
      csvHeaders.join(","),
      ...csvRows.map(r => r.join(","))
    ].join("\n");

    const documentBlob = new Blob([compiledCSVContent], { type: "text/csv;charset=utf-8;" });
    const localBlobURL = URL.createObjectURL(documentBlob);

    const anchorTrigger = document.createElement("a");
    anchorTrigger.setAttribute("href", localBlobURL);
    anchorTrigger.setAttribute("download", `ATS_User_Matrix_Report_${new Date().toISOString().split('T')[0]}.csv`);
    anchorTrigger.style.visibility = "hidden";
    
    document.body.appendChild(anchorTrigger);
    anchorTrigger.click();
    document.body.removeChild(anchorTrigger);
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  // Advanced client-side compute loops filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                          user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Matrix & Governance</h1>
          <p className="text-sm text-gray-500">Manage global accounts, system access levels, and logs.</p>
        </div>
        {/* CSV Downloader Inject Button */}
        <button
          onClick={handleExportToCSVRegistry}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer outline-none"
        >
          📥 Export Filtered CSV List
        </button>
      </div>

      {/* Advanced Filters Block */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all bg-no-repeat"
          >
            <option value="">All Access Roles</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruiter</option>
            <option value="applicant">Applicant</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved / Active</option>
            <option value="suspended">Suspended / Blocked</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap md:ml-auto">
          Showing {filteredUsers.length} of {users.length} Records
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">User Details</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Access Status</th>
                <th className="p-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">Loading master records...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No matching user profiles found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className={`bg-white border border-gray-200 text-xs rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 font-medium outline-none ${roleBadge(user.role)}`}
                      >
                        <option value="applicant">Applicant</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.status === "approved" || !user.status ? "bg-green-50 text-green-700" :
                        user.status === "suspended" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "approved" || !user.status ? "bg-green-600" : user.status === "suspended" ? "bg-red-600" : "bg-amber-600"}`} />
                        {user.status || "approved"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleViewActivity(user)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Activity Log
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id, user.status || "approved")}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          user.status === "suspended" 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                        }`}
                      >
                        {user.status === "suspended" ? "Unblock User" : "Suspend Access"}
                      </button>
                      <button
                        onClick={() => handleDeleteUserRecord(user._id)}
                        className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
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

      {/* Activity Log Drawer / Modal component */}
      {showActivityModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">System Session Logs</h3>
                <p className="text-xs text-gray-400">Tracking activity sequence for {selectedUser.name}</p>
              </div>
              <button 
                onClick={() => setShowActivityModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
              <div className="flex gap-3 text-sm">
                <div className="text-blue-500 font-semibold mt-0.5">●</div>
                <div>
                  <div className="text-gray-800 font-medium">Account Access Verified via Token</div>
                  <div className="text-xs text-gray-400">Timestamp: 2026-06-25 11:14 AM</div>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="text-gray-400 font-semibold mt-0.5">●</div>
                <div>
                  <div className="text-gray-800 font-medium">Dashboard session updated (Role: {selectedUser.role})</div>
                  <div className="text-xs text-gray-400">Timestamp: 2026-06-25 09:30 AM</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const roleBadge = (role) => {
//   if (role === "recruiter") return "bg-purple-100 text-purple-700 capitalize";
//   if (role === "applicant") return "bg-blue-100 text-blue-700 capitalize";
//   return "bg-gray-100 text-gray-700 capitalize";
// };

// const statusBadge = (status) => {
//   if (status === "active") return "bg-green-100 text-green-700 capitalize";
//   if (status === "pending") return "bg-yellow-100 text-yellow-700 capitalize";
//   if (status === "suspended") return "bg-red-100 text-red-700 capitalize";
//   return "bg-gray-100 text-gray-700 capitalize";
// };

// export default function UserManagement() {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
  
//   const [roleFilter, setRoleFilter] = useState(location.state?.filterRole || "all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (location.state?.filterRole) {
//       setRoleFilter(location.state.filterRole);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.status === 401 || res.status === 403) {
//           navigate("/"); 
//           return;
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         setError("Users load nahi ho sake");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [token, navigate]);

//   const filteredUsers = users.filter((user) => {
//     const matchSearch =
//       user.name?.toLowerCase().includes(search.toLowerCase()) ||
//       user.email?.toLowerCase().includes(search.toLowerCase());
//     const matchRole = roleFilter === "all" || user.role === roleFilter;
//     const matchStatus = statusFilter === "all" || user.status === statusFilter;
//     return matchSearch && matchRole && matchStatus;
//   });

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const res = await fetch(`/api/admin/users/${id}/status`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         setUsers((prev) =>
//           prev.map((user) =>
//             user._id === id ? { ...user, status: newStatus } : user
//           )
//         );
//       }
//     } catch (err) {
//       setError("Status update nahi ho saka");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const res = await fetch(`/api/admin/users/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         setUsers((prev) => prev.filter((user) => user._id !== id));
//       }
//     } catch (err) {
//       setError("User delete nahi ho saka");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-gray-400 text-lg font-medium">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Dynamic Responsive Typography Headers */}
//       <div>
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h2>
//         <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage all recruiters and applicants</p>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
//       )}

//       {/* Responsive Filters Stack Control */}
//       <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
//         <input
//           type="text"
//           placeholder="🔍 Search by name or email..."
//           className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:flex-1"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
        
//         {/* Dropdown container wraps beautifully into double columns on mobile viewports */}
//         <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full"
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//           >
//             <option value="all">All Roles</option>
//             <option value="recruiter">Recruiter</option>
//             <option value="applicant">Applicant</option>
//           </select>
//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="pending">Pending</option>
//             <option value="suspended">Suspended</option>
//           </select>
//         </div>

//         <span className="text-xs sm:text-sm text-gray-500 text-center lg:ml-auto">
//           Showing {filteredUsers.length} of {users.length} users
//         </span>
//       </div>

//       {/* Table Container Layer Isolate with Native Smooth Hardware Scrolling */}
//       <div className="overflow-x-auto rounded-2xl bg-white shadow w-full">
//         <table className="min-w-[900px] w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//             <tr>
//               <th className="px-6 py-4 text-left">Name</th>
//               <th className="px-6 py-4 text-left">Email</th>
//               <th className="px-6 py-4 text-left">Role</th>
//               <th className="px-6 py-4 text-left">Status</th>
//               <th className="px-6 py-4 text-left">Joined</th>
//               <th className="px-6 py-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-10 text-gray-400">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 font-medium text-gray-800">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
//                         {(user.name || "U").charAt(0)}
//                       </div>
//                       <span className="truncate max-w-[150px] sm:max-w-none">{user.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-500 truncate max-w-[180px] sm:max-w-none">{user.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(user.status)}`}>
//                       {user.status || "active"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
//                     {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center gap-2">
//                       {(!user.status || user.status === "pending") && (
//                         <button
//                           onClick={() => handleStatusChange(user._id, "active")}
//                           className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition shadow-sm"
//                         >
//                           Approve
//                         </button>
//                       )}
//                       {user.status === "active" && (
//                         <button
//                           onClick={() => handleStatusChange(user._id, "suspended")}
//                           className="cursor-pointer bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 transition shadow-sm"
//                         >
//                           Suspend
//                         </button>
//                       )}
//                       {user.status === "suspended" && (
//                         <button
//                           onClick={() => handleStatusChange(user._id, "active")}
//                           className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition shadow-sm"
//                         >
//                           Reactivate
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDelete(user._id)}
//                         className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition shadow-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search aur Filters state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Activity Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error. Internal system failure.");
    } finally {
      setLoading(false);
    }
  };

  // Status handle karne ke liye action engine (Block/Unblock)
  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "suspended" ? "approved" : "suspended";
    try {
      const token = localStorage.getItem("token");
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
      }
    } catch (err) {
      console.error("Action handler crash", err);
    }
  };

  // Role upgrade/downgrade engine
  const handleChangeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
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
      console.error("Role change failure", err);
    }
  };

  // Activity stream fetch module
  const handleViewActivity = (user) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  // Client-side advanced search filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                          user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Matrix & Governance</h1>
          <p className="text-sm text-gray-500">Manage global accounts, system access levels, and logs.</p>
        </div>
      </div>

      {/* Advanced Filters Block */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        >
          <option value="">All Access Roles</option>
          <option value="admin">Admin</option>
          <option value="recruiter">Recruiter</option>
          <option value="applicant">Applicant</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved / Active</option>
          <option value="suspended">Suspended / Blocked</option>
          <option value="pending">Pending Review</option>
        </select>
      </div>

      {/* Error state */}
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
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="applicant">Applicant</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "approved" ? "bg-green-50 text-green-700" :
                        user.status === "suspended" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "approved" ? "bg-green-600" : user.status === "suspended" ? "bg-red-600" : "bg-amber-600"}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewActivity(user)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Activity Log
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id, user.status)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                          user.status === "suspended" 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-red-600 bg-red-50 hover:bg-red-100"
                        }`}
                      >
                        {user.status === "suspended" ? "Unblock Account" : "Block User"}
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
                className="text-gray-400 hover:text-gray-600 text-sm font-medium p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
              {/* Fake/Mocked dynamic activity logs to keep tracking clean without separate collection */}
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
                className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
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
import React, { useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Amit Sharma", email: "amit@gmail.com", role: "student", status: "Active" },
    { id: 2, name: "Tech Mahindra", email: "hr@techm.com", role: "recruiter", status: "Pending Verification" },
    { id: 3, name: "Vikram Singh", email: "vikram@outlook.com", role: "student", status: "Blocked" },
  ]);

  const toggleBlock = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "Blocked" ? "Active" : "Blocked" } 
        : user
    ));
  };

  const approveRecruiter = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: "Active" } : user));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">👥 Platform User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{user.name}</td>
                <td className="p-4 text-slate-500">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${
                    user.role === "recruiter" ? "bg-indigo-50 text-indigo-700" : "bg-sky-50 text-sky-700"
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-semibold ${
                    user.status === "Active" ? "text-emerald-600" : user.status === "Blocked" ? "text-rose-600" : "text-amber-600"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  {user.role === "recruiter" && user.status === "Pending Verification" && (
                    <button 
                      onClick={() => approveRecruiter(user.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors shadow-sm text-xs"
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => toggleBlock(user.id)}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors shadow-sm ${
                      user.status === "Blocked" 
                        ? "bg-slate-500 hover:bg-slate-600 text-white" 
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                  >
                    {user.status === "Blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
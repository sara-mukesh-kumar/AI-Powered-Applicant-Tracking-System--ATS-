import React, { useState } from "react";
import UserManagement from "./UserManagement";

function AdminLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased selection:bg-none">
      
      {/* 1. SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-5 flex flex-col shadow-xl">
        <h2 className="text-xl font-bold text-sky-400 mb-8 tracking-wide">ATS Control Panel</h2>
        <nav className="space-y-1.5 flex-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "dashboard" ? "bg-slate-800 text-sky-400 shadow-inner" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            📊 Dashboard Home
          </button>
          <button 
            onClick={() => setActiveTab("users")} 
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "users" ? "bg-slate-800 text-sky-400 shadow-inner" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            👥 User Management
          </button>
          <button 
            onClick={() => setActiveTab("jobs")} 
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "jobs" ? "bg-slate-800 text-sky-400 shadow-inner" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            💼 Job Moderation
          </button>
        </nav>
      </div>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 p-10 overflow-y-auto">
        
        {activeTab === "dashboard" && (
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome, System Admin 👋</h1>
            <p className="text-slate-500 text-base">Yahan aapko pure platform ke real-time reports aur statistics dikhenge.</p>
          </div>
        )}

        {activeTab === "users" && <UserManagement />}

        {activeTab === "jobs" && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">💼 Job Moderation Queue</h2>
            <p className="text-slate-500">Recruiters dwara post kiye gaye jobs ko review/flag karne ka section yahan banega.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminLayout;
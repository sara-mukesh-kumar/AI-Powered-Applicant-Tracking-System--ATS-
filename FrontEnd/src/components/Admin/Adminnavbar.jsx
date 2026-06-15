import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  // Simple and clean Logout handling
  const handleLogout = () => {
    // 1. Token remove karo
    localStorage.removeItem('token'); 
    
    // 2. User ko login ya home page par redirect karo
    // Agar tumhare paas login route '/login' hai toh wahan bhej do, abhi ke liye '/' (Home) par bhej rahe hain
    navigate('/'); 
    
    // 3. Page refresh taaki state clear ho jaye aur route block ho jaye
    window.location.reload(); 
  };

  return (
    <nav className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Left side: Dynamic Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Admin Portal</h1>
        <p className="text-xs text-slate-500 hidden sm:block">Manage users, jobs, and system status</p>
      </div>

      {/* Right side: Profile and Logout Action */}
      <div className="flex items-center gap-4">
        {/* Admin Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-700 leading-none">System Admin</p>
            <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">Workspace</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="cursor-pointer px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
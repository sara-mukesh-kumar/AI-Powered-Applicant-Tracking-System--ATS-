import React from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const RecruiterNavbar = () => {
  const recruiter = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Left Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Recruiter Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Welcome back, {recruiter.name || "Recruiter"}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Search Box */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search candidates, jobs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <BellIcon className="h-6 w-6 text-gray-600" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Recruiter Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://i.pravatar.cc/40"
              alt="Recruiter"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />

            <div className="hidden md:block">
              <h3 className="font-medium text-slate-800">
                {recruiter.name || "HR Manager"}
              </h3>

              <p className="text-xs text-gray-500">
                Recruiter
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default RecruiterNavbar;
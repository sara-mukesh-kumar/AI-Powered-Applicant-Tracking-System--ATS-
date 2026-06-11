import React from "react";
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const RecruiterNavbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          ATS
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Recruiter Portal
        </h1>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-lg w-96">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search candidates..."
          className="bg-transparent outline-none ml-2 w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Messages */}
        <div className="relative cursor-pointer">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <BellIcon className="h-6 w-6 text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            5
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="Recruiter"
            className="w-10 h-10 rounded-full border"
          />
          <div className="hidden md:block">
            <h3 className="font-semibold text-gray-800">
              Recruiter
            </h3>
            <p className="text-xs text-gray-500">
              HR Manager
            </p>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default RecruiterNavbar;
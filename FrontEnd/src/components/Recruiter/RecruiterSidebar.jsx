import React from "react";
import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const RecruiterSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: HomeIcon,
    },
    {
      name: "Job Postings",
      icon: BriefcaseIcon,
    },
    {
      name: "Candidates",
      icon: UserGroupIcon,
    },
    {
      name: "Applications",
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "Interviews",
      icon: CalendarDaysIcon,
    },
    {
      name: "Analytics",
      icon: ChartBarIcon,
    },
    {
      name: "Settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          AI ATS
        </h1>
        <p className="text-sm text-gray-400">
          Recruiter Portal
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recruiter Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="Recruiter"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-medium">
              HR Manager
            </h3>

            <p className="text-xs text-gray-400">
              recruiter@company.com
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecruiterSidebar;
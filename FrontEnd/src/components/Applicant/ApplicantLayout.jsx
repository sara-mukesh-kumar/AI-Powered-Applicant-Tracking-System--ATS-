import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BriefcaseIcon,
  ChartBarSquareIcon,
  DocumentArrowUpIcon,
  UserCircleIcon,
  FolderOpenIcon,
  ArrowTrendingUpIcon,
  LockClosedIcon,
  Bars3Icon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import NotificationBanner from "../NotificationBanner";

const ApplicantLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigationItems = [
    { label: "Dashboard", path: "/applicant/dashboard", icon: HomeIcon },
    { label: "Find Jobs", path: "/applicant/joblisting", icon: BriefcaseIcon },
    { label: "My Profile", path: "/applicant/profile", icon: UserCircleIcon },
    { label: "Job Tracker", path: "/applicant/tracker", icon: ChartBarSquareIcon },
    { label: "Saved Jobs", path: "/applicant/savedjobs", icon: DocumentArrowUpIcon },
    { label: "Document Vault", path: "/applicant/resumeupload", icon: FolderOpenIcon },
    { label: "Analytics", path: "/applicant/analytics", icon: ArrowTrendingUpIcon },
    { label: "Privacy Controls", path: "/applicant/privacy", icon: LockClosedIcon }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const currentActiveItem = navigationItems.find(
    (item) => item.path.toLowerCase() === location.pathname.toLowerCase()
  ) || { label: "Applicant Portal" };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ========================================================
          SIDEBAR NAVIGATION (DESKTOP)
          ======================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-gradient-to-b from-slate-50 via-indigo-50/40 to-blue-50/30 border-r border-slate-100 text-slate-800 transition-all duration-300 relative ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="absolute top-6 -right-3.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-full p-1.5 shadow-md border border-slate-200/80 transition cursor-pointer z-20"
          type="button"
          aria-label={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarExpanded ? (
            <ChevronLeftIcon className="h-4.5 w-4.5" />
          ) : (
            <ChevronRightIcon className="h-4.5 w-4.5" />
          )}
        </button>

        {/* Logo Section */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-100 h-20 shrink-0">
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 font-black text-white text-base shadow-md shadow-indigo-500/20">
            AP
          </div>
          {sidebarExpanded && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="block font-black text-sm uppercase tracking-widest text-indigo-900 leading-none">
                ATS PRO
              </span>
              <span className="block text-[10px] font-bold text-indigo-500 mt-1 leading-none uppercase tracking-wider">
                Applicant Hub
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-md shadow-indigo-100/80 border border-indigo-100/40"
                    : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"}`} />
                {sidebarExpanded && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Quick Info / LogOut */}
        <div className="p-4 border-t border-slate-100 bg-white/60">
          {sidebarExpanded ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100/80 shadow-inner">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate leading-none text-slate-800">{user.name || "User"}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-1 leading-none">{user.email || "guest@atspro.in"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer shrink-0"
                title="Logout"
                type="button"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full h-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
              title="Logout"
              type="button"
            >
              <ArrowRightOnRectangleIcon className="h-5.5 w-5.5" />
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================
          MAIN WORKSPACE WRAPPER (HEADER + CONTENT)
          ======================================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8 z-10 shrink-0">
          
          {/* Page Title / Mobile Hamburger */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition shrink-0 cursor-pointer"
              aria-label="Open navigation"
              type="button"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                {currentActiveItem.label}
              </h1>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-4.5 shrink-0">
            
            {/* Quick Links (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-6 mr-4 text-sm font-semibold text-slate-600">
              <Link to="/applicant/joblisting" className="hover:text-blue-600 transition">Search Jobs</Link>
              <a href="#" className="hover:text-blue-600 transition cursor-pointer">Companies</a>
              <a href="#" className="hover:text-blue-600 transition cursor-pointer">Services</a>
            </div>

            {/* Notification Indicator */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative h-10.5 w-10.5 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                type="button"
                aria-label="Notifications"
              >
                <BellIcon className="h-5.5 w-5.5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              </button>
              
              {/* Notification Overlay Menu (Skeleton Setup) */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <p className="font-bold text-sm">Notifications</p>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New Alerts</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-sm">
                    {/* Skeleton Announcement */}
                    <div className="p-4 hover:bg-slate-50 transition cursor-pointer">
                      <p className="font-semibold text-slate-800">Welcome to ATS Pro!</p>
                      <p className="text-xs text-slate-500 mt-1">Complete your profile to increase employer discovery.</p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-medium">Just now</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown Profile Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="h-10.5 w-10.5 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-700 hover:bg-blue-200 border border-blue-200 transition cursor-pointer"
                type="button"
                aria-label="User profile menu"
              >
                {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
              </button>

              {/* Profile Context Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-sm truncate text-slate-900">{user.name || "User Name"}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email || "guest@atspro.in"}</p>
                  </div>
                  <Link
                    to="/applicant/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <UserCircleIcon className="h-5 w-5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/applicant/privacy"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    <span>Privacy Controls</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1.5" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                    type="button"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 scrollbar-thin">
          {/* ✅ Sahi generic reusable filter tag call karo */}
          <NotificationBanner />
          <Outlet />
        </main>

      </div>

      {/* ========================================================
          MOBILE NAVIGATION SLIDE-OUT MENU
          ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Sidebar Drawer */}
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-950 text-white flex flex-col p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white text-base">
                  AP
                </div>
                <div>
                  <span className="block font-black text-sm uppercase tracking-widest text-slate-200 leading-none">
                    ATS PRO
                  </span>
                  <span className="block text-xs font-semibold text-blue-400 mt-1 leading-none">
                    Applicant Hub
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Mobile Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition group ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5.5 w-5.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Drawer Footer User Section */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-200 border border-blue-800">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate leading-none">{user.name || "User"}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-1 leading-none">{user.email || "guest@atspro.in"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer"
                title="Logout"
                type="button"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>

          </aside>
        </div>
      )}

    </div>
  );
};

export default ApplicantLayout;

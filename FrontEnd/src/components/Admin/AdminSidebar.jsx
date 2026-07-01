import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { label: "User Management", path: "/admin/users", icon: "👥" },
  { label: "Jobs Overview", path: "/admin/jobs", icon: "💼" },
  { label: "Applications", path: "/admin/applications", icon: "📋" },
  { label: "System Broadcast", path: "/admin/broadcast", icon: "📢" },
  { label: "Communication", path: "/admin/communication", icon: "✉️" }, 
  { label: "System Audit Logs", path: "/admin/audit-logs", icon: "🛡️" },
  { label: "Reporting Dashboard", path: "/admin/analytics-report", icon: "📉" },
  { label: "AI Scoring Rules", path: "/admin/ai-control", icon: "🤖" },
{ label: "Resume Controls", path: "/admin/resume-hub", icon: "🖨️" } ,
];

export default function AdminSidebar({ closeMobileMenu }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the Admin Panel?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (closeMobileMenu) closeMobileMenu();
      navigate("/");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-950 text-white select-none shadow-xl md:sticky md:top-0 md:h-screen md:w-64 border-r border-gray-850">
      {/* Brand Logo Header */}
      <div className="px-6 py-5 border-b border-gray-850/60 bg-gray-900/20">
        <h1 className="text-xl font-bold text-blue-400 tracking-tight flex items-center gap-2">
          <span>🤖</span> ATS Admin
        </h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
          Management Panel
        </p>
      </div>

      {/* Interactive Navigation Link Items Matrix */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => closeMobileMenu && closeMobileMenu()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform outline-none
              ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-bold scale-102"
                : "text-gray-400 hover:bg-gray-900/60 hover:text-white hover:translate-x-1 hover:scale-101"
              }`
            }
          >
            <span className="text-base filter drop-shadow-sm">{item.icon}</span>
            <span className="tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Log Out Action Block */}
      <div className="px-4 py-5 border-t border-gray-850/60 bg-gray-900/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 text-red-600 bg-red-50/5 hover:bg-red-50/10 border border-red-500/20 font-medium text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Delete Token Logout
        </button>
      </div>
    </div>
  );
}
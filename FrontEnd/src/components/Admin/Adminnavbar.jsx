import { useNavigate } from "react-router-dom";

// onMenuToggle prop receive kiya layout control ke liye
function AdminNavbar({ onMenuToggle }) {
  const navigate = useNavigate();

  // Local storage se admin user details aur name parse karna
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the Admin Panel?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-sm/5">
      
      {/* Left Branding Side Metadata + Hamburger Button */}
      <div className="flex items-center gap-3">
        {/* HAMBURGER TRIGGER BUTTON: Sirf mobile/tablet par dikhega, desktop (md) par hidden rahega */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="cursor-pointer md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
          <p className="text-[10px] sm:text-xs font-medium text-gray-400 mt-0.5 hidden xs:block">
            Manage users, job positions, and platform status
          </p>
        </div>
      </div>

      {/* Right Control Profile Actions Panel */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Workspace Identifier Label */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-gray-800">
            {user.name || "System Admin"}
          </span>
          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-0.5 self-end">
            Workspace
          </span>
        </div>

        {/* Dynamic Circular User Initial Avatar Badge */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-blue-100 uppercase">
          {(user.name || "A").charAt(0)}
        </div>

        {/* Vertical Separator Divider */}
        <div className="h-6 w-[1px] bg-gray-200"></div>

        {/* Dynamic Action Logout Controller Trigger */}
        <button
          onClick={handleLogout}
          className="cursor-pointer group flex items-center gap-1 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm/10"
        >
          <span className="transition-transform duration-200 group-hover:translate-x-0.5 hidden xs:inline">
            Logout
          </span>
          <span className="text-sm xs:text-xs">➔</span>
        </button>

      </div>
    </header>
  );
}

export default AdminNavbar;
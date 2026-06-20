import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// StatCard clickable hai aur responsive layout transitions hold karta hai
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="cursor-pointer bg-white rounded-2xl shadow p-5 sm:p-6 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:translate-y-0 select-none"
  >
    <div className={`text-3xl sm:text-4xl p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalRecruiters: 0,
    totalApplicants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/"); 
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Stats load nahi ho sake");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-base sm:text-lg font-medium">Loading Stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Welcome back, {user.name || "Admin"} 👋
        </p>
      </div>

      {/* Error View Container */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Responsive Grid System: Mobile (1 column), Tablet (2 columns), Desktop (4 columns) */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Jobs Card */}
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs} 
          icon="💼" 
          color="bg-blue-100" 
          onClick={() => navigate("/admin/jobs")}
        />
        
        {/* Total Applications Card */}
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          icon="📋" 
          color="bg-green-100" 
          onClick={() => navigate("/admin/applications")}
        />
        
        {/* Total Recruiters Card */}
        <StatCard 
          title="Total Recruiters" 
          value={stats.totalRecruiters} 
          icon="🧑‍💼" 
          color="bg-purple-100" 
          onClick={() => navigate("/admin/users", { state: { filterRole: "recruiter" } })}
        />
        
        {/* Total Applicants Card */}
        <StatCard 
          title="Total Applicants" 
          value={stats.totalApplicants} 
          icon="👥" 
          color="bg-yellow-100" 
          onClick={() => navigate("/admin/users", { state: { filterRole: "applicant" } })}
        />
      </div>

      {/* Quick Actions Panel with wrap handling for small width viewports */}
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-col xs:flex-row flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="cursor-pointer w-full xs:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/applications")}
            className="cursor-pointer w-full xs:w-auto text-center bg-green-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-green-700 transition"
          >
            📋 View Applications
          </button>
          <button
            onClick={() => navigate("/admin/jobs")}
            className="cursor-pointer w-full xs:w-auto text-center bg-purple-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-purple-700 transition"
          >
            💼 View Jobs
          </button>
        </div>
      </div>

    </div>
  );
}
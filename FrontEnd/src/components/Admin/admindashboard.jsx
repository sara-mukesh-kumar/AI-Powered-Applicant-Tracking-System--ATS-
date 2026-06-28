import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple and responsive StatCard component with custom actions
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
    aiUsageCount: 0,
    failedParsingCount: 0
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
        setError("Dashboard statistics fetch protocol crashed.");
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
        <p className="text-gray-400 text-base sm:text-lg font-medium animate-pulse">Loading System Stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header Description Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Welcome back, {user.name || "Admin"} 👋
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* 3x2 Grid layout showing standard metrics alongside brand-new AI insights */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs} 
          icon="💼" 
          color="bg-blue-100 text-blue-700" 
          onClick={() => navigate("/admin/jobs")}
        />
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          icon="📋" 
          color="bg-green-100 text-green-700" 
          onClick={() => navigate("/admin/applications")}
        />
        <StatCard 
          title="Registered Recruiters" 
          value={stats.totalRecruiters} 
          icon="🧑‍💼" 
          color="bg-purple-100 text-purple-700" 
          onClick={() => navigate("/admin/users", { state: { filterRole: "recruiter" } })}
        />
        <StatCard 
          title="Applicant Pool" 
          value={stats.totalApplicants} 
          icon="👥" 
          color="bg-yellow-100 text-yellow-700" 
          onClick={() => navigate("/admin/users", { state: { filterRole: "applicant" } })}
        />
        {/* NEW AI CARDS */}
        <StatCard 
          title="AI Parsing Cycles" 
          value={stats.aiUsageCount || 0} 
          icon="🤖" 
          color="bg-indigo-100 text-indigo-700" 
          onClick={() => navigate("/admin/applications")}
        />
        <StatCard 
          title="OCR / Parsing Failures" 
          value={stats.failedParsingCount || 0} 
          icon="⚠️" 
          color="bg-red-100 text-red-700" 
          onClick={() => navigate("/admin/applications")}
        />
      </div>

      {/* Action Center Block */}
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-col xs:flex-row flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="cursor-pointer w-full xs:w-auto text-center bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-blue-700 transition font-medium"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/applications")}
            className="cursor-pointer w-full xs:w-auto text-center bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-green-700 transition font-medium"
          >
            📋 View Applications
          </button>
          <button
            onClick={() => navigate("/admin/jobs")}
            className="cursor-pointer w-full xs:w-auto text-center bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-purple-700 transition font-medium"
          >
            💼 View Jobs
          </button>
        </div>
      </div>

    </div>
  );
}
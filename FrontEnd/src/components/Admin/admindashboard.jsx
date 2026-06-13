import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
    <div className={`text-4xl p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
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
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/admin/login");
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
  }, []);

  // Logged in admin ka naam
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user.name || "Admin"} 👋
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Jobs" value={stats.totalJobs} icon="💼" color="bg-blue-100" />
        <StatCard title="Total Applications" value={stats.totalApplications} icon="📋" color="bg-green-100" />
        <StatCard title="Total Recruiters" value={stats.totalRecruiters} icon="🧑‍💼" color="bg-purple-100" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon="👥" color="bg-yellow-100" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/applications")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
          >
            📋 View Applications
          </button>
          <button
            onClick={() => navigate("/admin/jobs")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
          >
            💼 View Jobs
          </button>
        </div>
      </div>

    </div>
  );
}
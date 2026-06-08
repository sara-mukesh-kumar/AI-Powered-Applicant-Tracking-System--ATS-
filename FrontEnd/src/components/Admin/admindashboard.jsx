import { useState, useEffect } from "react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
    <div className={`text-4xl p-3 rounded-xl ${color}`}>
      {icon}
    </div>
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        // Backend nahi bana abhi — dummy data use karo
        setStats({
          totalJobs: 24,
          totalApplications: 189,
          totalRecruiters: 12,
          totalApplicants: 143,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
          color="bg-blue-100"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="📋"
          color="bg-green-100"
        />
        <StatCard
          title="Total Recruiters"
          value={stats.totalRecruiters}
          icon="🧑‍💼"
          color="bg-purple-100"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon="👥"
          color="bg-yellow-100"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { text: "New recruiter registered — TechCorp", time: "2 mins ago", color: "bg-blue-500" },
            { text: "New application submitted — Frontend Dev", time: "15 mins ago", color: "bg-green-500" },
            { text: "Job posted — Senior React Developer", time: "1 hour ago", color: "bg-purple-500" },
            { text: "Recruiter approved — HR Solutions", time: "3 hours ago", color: "bg-yellow-500" },
            { text: "Application status updated — Offered", time: "5 hours ago", color: "bg-red-500" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <p className="text-sm text-gray-600 flex-1">{item.text}</p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            + Add Recruiter
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
            📋 View All Applications
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
            💼 View All Jobs
          </button>
        </div>
      </div>

    </div>
  );
}
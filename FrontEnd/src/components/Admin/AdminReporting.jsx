import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";

export default function AdminReporting() {
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, totalRecruiters: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // System-wide growth tracking trend mock datasets
  const monthlyTrendData = [
    { month: "Jan", applications: 35, jobs: 12 },
    { month: "Feb", applications: 52, jobs: 18 },
    { month: "Mar", applications: 45, jobs: 15 },
    { month: "Apr", applications: 78, jobs: 28 },
    { month: "May", applications: 95, jobs: 32 },
    { month: "Jun", applications: 135, jobs: 40 },
  ];

  // AI Funnel status conversion ratio mapping parameters
  const hiringFunnelData = [
    { name: "Applied Pool", count: 280, fill: "#3b82f6" },
    { name: "AI Shortlisted", count: 140, fill: "#10b981" },
    { name: "System Rejected", count: 90, fill: "#ef4444" },
  ];

  // Tech stack domain distribution matrix 
  const domainAllocationData = [
    { name: "Frontend openings", value: 45 },
    { name: "Backend Core", value: 35 },
    { name: "AI & Data Track", value: 20 },
  ];

  const COLOR_PALETTE = ["#3b82f6", "#10b981", "#8b5cf6"];

  useEffect(() => {
    fetchLiveStatsEngine();
  }, []);

  const fetchLiveStatsEngine = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.message || "Failed to load master statistics counters");
      }
    } catch (err) {
      setError("Network reporting metrics pipeline breakdown.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm font-medium animate-pulse">Assembling system performance analytics matrix...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Module Summary Header Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Performance Analytics</h1>
          <p className="text-sm text-gray-500">Audit system-wide resource distribution profiles, growth trajectories, and metrics funnel.</p>
        </div>
        <button 
          onClick={fetchLiveStatsEngine}
          className="text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          🔄 Refresh Analytics Stream
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>
      )}

      {/* Raw Metrics Redirection Counters Grid Block */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase">Live Openings</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.totalJobs || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase">Total Submissions</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.totalApplications || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase">Registered Recruiters</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.totalRecruiters || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase">Applicant Pool</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.totalApplicants || 0}</div>
        </div>
      </div>

      {/* Primary Chart Visualization Layer Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Line Chart - Month-on-Month System Traction Trend Line */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Application Trajectory Feed</h3>
            <p className="text-xs text-gray-400">Linear progression mapping cross-checking platform growth parameters.</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #f3f4f6" }} />
                <Legend />
                <Line type="monotone" dataKey="applications" name="Submissions" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="jobs" name="Positions Posted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bar Chart - AI Screening Conversion Funnel Metrics */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Hiring Funnel Conversion Ratio</h3>
            <p className="text-xs text-gray-400">Visual data matrix highlighting screening stage drop-off limits.</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="count" name="Candidates Count" radius={[6, 6, 0, 0]} barSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pie Chart - Domain-wise Category Mappings (Full Width Footer Span Block) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4 xl:col-span-2 max-w-2xl mx-auto w-full">
          <div className="text-center">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tech Domain Allocation Profile</h3>
            <p className="text-xs text-gray-400">Segmentation mapping current structural pipeline load metrics balance.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64">
            <div className="h-full w-60 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={domainAllocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                    {domainAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend Labels Mapping panel */}
            <div className="space-y-2.5 text-sm text-gray-600">
              {domainAllocationData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE[index] }} />
                  <span className="font-semibold text-gray-800">{item.name}:</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm font-bold">({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
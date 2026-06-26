import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";

export default function AdminReporting() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mocked Structured Data Aggregations directly syncable via dynamic endpoint loops later
  const trendData = [
    { month: "Jan", applications: 35 },
    { month: "Feb", applications: 52 },
    { month: "Mar", applications: 45 },
    { month: "Apr", applications: 78 },
    { month: "May", applications: 95 },
    { month: "Jun", applications: 120 },
  ];

  const funnelData = [
    { name: "Applied", count: 240, fill: "#3b82f6" },
    { name: "Shortlisted", count: 110, fill: "#10b981" },
    { name: "Rejected", count: 70, fill: "#ef4444" },
  ];

  const domainData = [
    { name: "Frontend Node", value: 40 },
    { name: "Backend Core", value: 35 },
    { name: "AI Integration", value: 25 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

  useEffect(() => {
    // Mimic real server persistence check delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm font-medium">Synthesizing master analytical matrices...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Upper Title Description Banner */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Performance Analytics</h1>
        <p className="text-sm text-gray-500">Monitor systemic conversion parameters, metric distributions, and active logs.</p>
      </div>

      {/* Main Charts Visual Grid Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Line Chart Block - Application Activity Stream Trends */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-50 pb-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Application Trajectory Feed</h3>
            <p className="text-xs text-gray-400">Month-on-month processing metrics pipeline timeline check.</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #f3f4f6" }} />
                <Legend />
                <Line type="monotone" dataKey="applications" name="Submissions" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bar Chart Block - Conversion Funnel Parameters */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-50 pb-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Hiring Funnel Status</h3>
            <p className="text-xs text-gray-400">Audit execution status logs for applicant screening state shifts.</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="count" name="Candidates count" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pie Chart Block - Job Domain Matrix Distribution */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4 md:col-span-1 xl:col-span-2 max-w-2xl mx-auto w-full">
          <div className="border-b border-gray-50 pb-2 text-center">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job Category Weight Allocation</h3>
            <p className="text-xs text-gray-400">Distribution profile segment mapped against system open logs.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-64">
            <div className="h-full w-60 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={domainData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Color Identity Labels Panel */}
            <div className="space-y-2 text-sm text-gray-600">
              {domainData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="font-medium text-gray-800">{item.name}:</span>
                  <span className="text-xs text-gray-400">({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
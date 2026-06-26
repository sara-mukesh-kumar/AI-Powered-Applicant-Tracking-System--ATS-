import { useState } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

const ApplicantAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30");

  // Mock data for recruiter views
  const viewsData = [
    { label: "Mon", count: 12 },
    { label: "Tue", count: 19 },
    { label: "Wed", count: 15 },
    { label: "Thu", count: 28 },
    { label: "Fri", count: 22 },
    { label: "Sat", count: 8 },
    { label: "Sun", count: 10 }
  ];

  // Mock matching keywords
  const keywordsData = [
    { word: "React", count: 45, percentage: 95 },
    { word: "Node.js", count: 32, percentage: 80 },
    { word: "Tailwind CSS", count: 29, percentage: 75 },
    { word: "Express", count: 20, percentage: 60 },
    { word: "MongoDB", count: 18, percentage: 55 }
  ];

  // SVG Chart variables
  const maxViewCount = Math.max(...viewsData.map(d => d.count));
  const chartHeight = 140;
  const chartWidth = 500;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-flex items-center gap-1.5 mb-3">
            <SparklesIcon className="w-3.5 h-3.5" /> Performance Dashboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Applicant Analytics</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Track recruiter views, keyword relevance, and see how your profile ranks in search algorithms.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400" />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
            <EyeIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Profile Views (7d)</p>
            <p className="text-3xl font-extrabold text-slate-800">114</p>
            <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">↑ 24% vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Match Rank</p>
            <p className="text-3xl font-extrabold text-slate-800">Top 8%</p>
            <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">Based on key skills</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <ArrowTrendingUpIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Search Appearances</p>
            <p className="text-3xl font-extrabold text-slate-800">412</p>
            <span className="text-xs font-bold text-indigo-600 mt-1 inline-block">Appeared in recruiter searches</span>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: Recruiter Views Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recruiter Views Timeline</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-bold text-slate-600 bg-slate-100 border-none rounded-xl p-2 focus:outline-none"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <div className="w-full">
            {/* SVG Line / Bar Chart */}
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2={chartWidth} y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="130" x2={chartWidth} y2="130" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Bars */}
              {viewsData.map((d, index) => {
                const barWidth = 32;
                const gap = (chartWidth - viewsData.length * barWidth) / (viewsData.length - 1);
                const x = index * (barWidth + gap);
                const barHeight = (d.count / maxViewCount) * 90; // scale to 90px max
                const y = 130 - barHeight;

                return (
                  <g key={d.label} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill="url(#indigo-grad)"
                      className="transition-all duration-300 hover:opacity-85"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {d.count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y="145"
                      textAnchor="middle"
                      className="text-xs font-bold fill-slate-400"
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Card: Keyword Matches */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Top Search Keywords</h3>
            <p className="text-xs text-slate-400 mt-1">Keywords used by recruiters to discover your profile.</p>
          </div>

          <div className="space-y-4">
            {keywordsData.map((k) => (
              <div key={k.word} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">{k.word}</span>
                  <span className="font-semibold text-slate-500">{k.count} matches</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${k.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicantAnalytics;

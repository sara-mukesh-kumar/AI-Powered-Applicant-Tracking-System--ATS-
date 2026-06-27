import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ApplicantDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      await Promise.resolve();
      try {
        setLoading(true);
        // 1. Fetch Profile
        const profileRes = await fetch("http://localhost:5000/api/applicant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.ok ? await profileRes.json() : null;
          setProfile(profileData);
        }

        // 2. Fetch Applications
        const appsRes = await fetch("http://localhost:5000/api/applicant/applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        let appsData = [];
        if (appsRes.ok) {
          const resJson = await appsRes.json();
          appsData = resJson.applications || [];
          setApplications(appsData);
        }

        // 3. Fetch Jobs & Recommend based on skills
        const jobsRes = await fetch("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const jobsList = jobsData.jobs || [];
          // Filter matching jobs based on skills overlap
          const userSkills = profileData?.skills || [];
          const recommended = jobsList
            .map(job => {
              const matched = job.requiredSkills?.filter(s =>
                userSkills.some(us => us.toLowerCase() === s.toLowerCase())
              ) || [];
              const percent = job.requiredSkills?.length
                ? Math.round((matched.length / job.requiredSkills.length) * 100)
                : 60;
              return { ...job, matchPercentage: percent };
            })
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 4);
          
          setRecommendedJobs(recommended);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Calculate dynamic stats
  const totalApplied = applications.length;
  const interviewingCount = applications.filter(a => a.status === "Interview").length;
  const offersCount = applications.filter(a => a.status === "Offered").length;

  const stats = [
    { label: "Applied Jobs", value: totalApplied.toString(), helper: `${totalApplied} applications submitted`, color: "text-blue-600", background: "bg-blue-50" },
    { label: "Interviews", value: interviewingCount.toString(), helper: `${interviewingCount} interviews scheduled`, color: "text-amber-600", background: "bg-amber-50" },
    { label: "Offers Received", value: offersCount.toString(), helper: `${offersCount} offers received`, color: "text-emerald-600", background: "bg-emerald-50" },
  ];

  // Calculate profile completion progress
  const calculateCompletion = () => {
    if (!profile) return 60;
    let points = 50; // base points
    if (profile.designation && profile.designation !== "Applicant") points += 10;
    if (profile.location) points += 10;
    if (profile.summary) points += 10;
    if (profile.skills && profile.skills.length > 0) points += 10;
    if (profile.experience && profile.experience.length > 0) points += 10;
    return Math.min(points, 100);
  };

  const completionPct = calculateCompletion();
  const userName = profile?.name || JSON.parse(localStorage.getItem("user") || "{}").name || "Candidate";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center p-12 text-indigo-650 font-bold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="text-slate-900 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        
        <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-block mb-3">
          Candidate Dashboard
        </span>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Good Day, {userName}!</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/90 font-medium">
          Manage your job hunts, monitor interview pipelines, and match with the top opportunities curated especially for you.
        </p>

        {/* Quick Search Bar Shortcut */}
        <div className="mt-6 max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 flex items-center shadow-inner">
          <span className="text-indigo-200 pl-3">🔍</span>
          <input
            type="text"
            placeholder="Search matching roles directly..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-indigo-200 px-2 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/applicant/joblisting");
            }}
          />
          <button
            onClick={() => navigate("/applicant/joblisting")}
            className="bg-white text-indigo-700 hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Find Jobs
          </button>
        </div>
      </section>

      {/* Metrics Stats */}
      <section className="grid gap-6 md:grid-cols-3" aria-label="Application summary">
        {stats.map((stat) => (
          <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition duration-300" key={stat.label}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.background} shadow-sm`}>
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="font-extrabold text-slate-800 text-sm">{stat.label}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{stat.helper}</p>
          </article>
        ))}
      </section>

      {/* Middle Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Profile Completion */}
        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Profile Strength</p>
                <h2 className="mt-1 text-lg font-black text-slate-800">Completion Status</h2>
              </div>
              <div className="grid gap-2.5 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-2">
                  <span className={profile?.name ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span> Name verified
                </div>
                <div className="flex items-center gap-2">
                  <span className={profile?.skills?.length > 0 ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span> Professional skills updated
                </div>
                <div className="flex items-center gap-2">
                  <span className={profile?.resumeUrl ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span> Resume uploaded
                </div>
                <div className="flex items-center gap-2">
                  <span className={profile?.experience?.length > 0 ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span> Work history updated
                </div>
              </div>
            </div>
            
            {/* SVG Circular Ring */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#f8fafc"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="url(#progressGrad)"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={238.76}
                  strokeDashoffset={238.76 - (238.76 * completionPct) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Defs for Gradient */}
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800">{completionPct}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Strength</span>
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-2xl bg-indigo-50 py-3.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100/80 hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            onClick={() => navigate("/applicant/profile")}
            type="button"
          >
            Complete Profile
          </button>
        </article>

        {/* Profile Views Chart */}
        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Performance</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Profile Visibility</h2>
          <div className="mt-6">
            <div className="flex items-end gap-2.5 h-16">
              {[
                { label: "M", h: "h-8", views: 4 },
                { label: "T", h: "h-10", views: 6 },
                { label: "W", h: "h-6", views: 3 },
                { label: "T", h: "h-16", views: 8, active: true },
                { label: "F", h: "h-14", views: 7 },
                { label: "S", h: "h-12", views: 5 },
                { label: "S", h: "h-8", views: 4 }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      item.active ? "bg-gradient-to-t from-indigo-500 to-indigo-600 shadow-sm" : "bg-indigo-50 hover:bg-indigo-100"
                    } ${item.h}`}
                    title={`${item.views} recruiter views`}
                  />
                  <span className={`text-[10px] font-bold ${item.active ? "text-indigo-600" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-6">
              <div>
                <p className="text-xl font-black text-slate-800">37</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Views</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-600">+15%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">vs last week</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Schedules and Inquiries */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Interviews */}
        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Schedule</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Upcoming Interviews</h2>
          <div className="mt-5 space-y-3">
            {applications.filter(a => a.status === "Interview").length > 0 ? (
              applications.filter(a => a.status === "Interview").map((app, idx) => (
                <div key={idx} className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800">{app.jobId?.title || "Role"}</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{app.jobId?.company || "Recruiting Firm"}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-md">Scheduled</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <span>🕒</span> Date to be shared by Recruiter
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-450 font-medium">
                No interviews scheduled yet. Keep applying!
              </div>
            )}
          </div>
        </article>

        {/* Message Inquiries */}
        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Messages</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Recent Inquiries</h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100/60 bg-slate-50/40 p-3 hover:bg-slate-50 hover:shadow-sm transition cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-xs font-black text-indigo-600 border border-indigo-100/40">
                AB
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-slate-800">ABC Technologies</p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">Interested in your React skills...</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 shrink-0">2h ago</span>
            </div>
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100/60 bg-slate-50/40 p-3 hover:bg-slate-50 hover:shadow-sm transition cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-xs font-black text-indigo-600 border border-indigo-100/40">
                PL
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-slate-800">Pixel Labs</p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">Your profile matches our opening...</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 shrink-0">5h ago</span>
            </div>
          </div>
        </article>
      </section>

      {/* Recent Applications table */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100/60">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Tracking</p>
            <h2 className="mt-1 text-lg font-black text-slate-800">Recent Applications</h2>
          </div>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition cursor-pointer" onClick={() => navigate("/applicant/tracker")} type="button">
            View Details
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                {["Job Role", "Company", "Applied On", "Status"].map((heading) => (
                  <th className="px-6 py-4 font-extrabold" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {applications.length > 0 ? (
                applications.slice(0, 5).map((app) => (
                  <tr className="transition hover:bg-slate-50/50" key={app._id}>
                    <td className="px-6 py-4 font-bold text-slate-900">{app.jobId?.title || "Role"}</td>
                    <td className="px-6 py-4 text-slate-500">{app.jobId?.company || "Recruiter"}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                        app.status === "Interview" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        app.status === "Offered" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        app.status === "Rejected" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>{app.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-450 font-medium">
                    No active applications. Send your first application to begin tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommended Jobs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated For You</p>
            <h2 className="mt-1 text-lg font-black text-slate-800">Recommended Jobs</h2>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition" onClick={() => navigate("/applicant/joblisting")} type="button">
            View All
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between" key={job._id}>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-950">{job.title}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-450">{job.recruiterId?.name || "Recruiter Team"}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 border border-indigo-100/30">
                      {job.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2 text-xs font-semibold text-slate-500">
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">{job.location || "Remote"}</span>
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">{job.experienceLevel || "Mid Level"}</span>
                  </div>
                </div>
                <button
                  className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition cursor-pointer hover:shadow-indigo-600/20"
                  onClick={() => navigate("/applicant/joblisting")}
                  type="button"
                >
                  View Job Details
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-450 font-medium">
              No matching recommended jobs. Add more skills to your profile to get recommended roles!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ApplicantDashboard;

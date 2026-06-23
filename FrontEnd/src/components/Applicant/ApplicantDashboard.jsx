import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Applied Jobs", value: "0", helper: "No applications yet", color: "text-blue-600", background: "bg-blue-50" },
  { label: "Interviews", value: "0", helper: "No interviews scheduled", color: "text-amber-600", background: "bg-amber-50" },
  { label: "Offers", value: "0", helper: "No offers yet", color: "text-emerald-600", background: "bg-emerald-50" },
];

const applications = [];

const recommendedJobs = [
  { title: "MERN Stack Developer", company: "ABC Technologies", location: "Chennai", type: "Full Time", match: "92% Match" },
  { title: "React Developer", company: "XYZ Solutions", location: "Bangalore", type: "Remote", match: "88% Match" },
];

function ApplicantDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="text-slate-900 space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl shadow-indigo-100/40">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-200">Welcome back</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{user.name || "Applicant"}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/90 font-medium">
          Your dashboard is fully set up. Discover matching opportunities, track your ongoing applications, and manage your professional profile.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-xl bg-white px-5.5 py-3 text-xs font-bold text-indigo-600 shadow-lg shadow-indigo-900/10 hover:bg-slate-50 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate("/applicant/joblisting")}
            type="button"
          >
            Browse Jobs
          </button>
          <button
            className="rounded-xl border border-white/30 bg-white/10 px-5.5 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate("/applicant/resumeupload")}
            type="button"
          >
            Update Resume
          </button>
        </div>
      </section>

      {/* Metrics Stats */}
      <section className="grid gap-5 md:grid-cols-3" aria-label="Application summary">
        {stats.map((stat) => (
          <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300" key={stat.label}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.background} shadow-sm`}>
              <span className={`text-base font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="font-extrabold text-slate-800 text-sm">{stat.label}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">{stat.helper}</p>
          </article>
        ))}
      </section>

      {/* Middle Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Profile Completion */}
        <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Profile Strength</p>
              <h2 className="mt-1 text-lg font-black text-slate-800">Completion Status</h2>
            </div>
            <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">80%</span>
          </div>
          <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: "80%" }} />
          </div>
          <div className="mt-6 grid gap-2.5 text-xs text-slate-500 font-semibold sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Personal details added
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Professional skills updated
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <span className="animate-pulse">●</span> Resume needs update
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <span className="animate-pulse">●</span> LinkedIn integration missing
            </div>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-indigo-50 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-100/80 transition cursor-pointer"
            onClick={() => navigate("/applicant/profile")}
            type="button"
          >
            Complete Profile
          </button>
        </article>

        {/* Profile Views Charts */}
        <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Performance</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Profile Visibility</h2>
          <div className="mt-6">
            <div className="flex items-end gap-2.5 h-16">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-8 w-full bg-indigo-50 hover:bg-indigo-100 rounded-lg transition" title="Mon: 4 views"></div>
                <span className="text-[10px] font-bold text-slate-400">M</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-10 w-full bg-indigo-100 hover:bg-indigo-200 rounded-lg transition" title="Tue: 6 views"></div>
                <span className="text-[10px] font-bold text-slate-400">T</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-6 w-full bg-indigo-50 hover:bg-indigo-100 rounded-lg transition" title="Wed: 3 views"></div>
                <span className="text-[10px] font-bold text-slate-400">W</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-16 w-full bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-lg shadow-sm" title="Thu: 8 views"></div>
                <span className="text-[10px] font-bold text-indigo-600">T</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-14 w-full bg-indigo-400 hover:bg-indigo-500 rounded-lg transition" title="Fri: 7 views"></div>
                <span className="text-[10px] font-bold text-slate-400">F</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-12 w-full bg-indigo-200 hover:bg-indigo-300 rounded-lg transition" title="Sat: 5 views"></div>
                <span className="text-[10px] font-bold text-slate-400">S</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-8 w-full bg-indigo-50 hover:bg-indigo-100 rounded-lg transition" title="Sun: 4 views"></div>
                <span className="text-[10px] font-bold text-slate-400">S</span>
              </div>
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
        <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Schedule</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Upcoming Interviews</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850">Frontend Developer</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-400">XYZ Solutions</p>
                </div>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">June 12</span>
              </div>
              <p className="mt-3 text-xs font-bold text-slate-650 flex items-center gap-1.5">
                <span>🕒</span> 10:00 AM · Video interview
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-50 bg-indigo-50/20 p-4 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850">React Developer</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-400">Pixel Labs</p>
                </div>
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-md">June 15</span>
              </div>
              <p className="mt-3 text-xs font-bold text-slate-650 flex items-center gap-1.5">
                <span>🕒</span> 2:00 PM · Technical round
              </p>
            </div>
          </div>
        </article>

        {/* Message Inquiries */}
        <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Messages</p>
          <h2 className="mt-1 text-lg font-black text-slate-800">Recent Inquiries</h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100/60 bg-slate-50/40 p-3 hover:bg-slate-50 hover:shadow-sm transition cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-xs font-black text-indigo-600 border border-indigo-100/40">
                AB
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-slate-800">ABC Technologies</p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">Interested in your React skills...</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 shrink-0">2h ago</span>
            </div>
            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100/60 bg-slate-50/40 p-3 hover:bg-slate-50 hover:shadow-sm transition cursor-pointer">
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
          <button
            className="mt-5 w-full rounded-xl border border-slate-100 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            type="button"
          >
            View All Messages
          </button>
        </article>
      </section>

      {/* Recent Applications table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100/60">
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
                applications.map((application) => (
                  <tr className="transition hover:bg-slate-50/50" key={application.job}>
                    <td className="px-6 py-4 font-bold text-slate-900">{application.job}</td>
                    <td className="px-6 py-4 text-slate-500">{application.company}</td>
                    <td className="px-6 py-4 text-slate-400">{application.date}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${application.style}`}>{application.status}</span>
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
          {recommendedJobs.map((job) => (
            <article className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between" key={job.title}>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-950">{job.title}</h3>
                    <p className="mt-1 text-xs font-bold text-slate-400">{job.company}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 border border-indigo-100/30">{job.match}</span>
                </div>
                <div className="mt-4 flex gap-2 text-xs font-semibold text-slate-500">
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">{job.location}</span>
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">{job.type}</span>
                </div>
              </div>
              <button
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition cursor-pointer hover:shadow-indigo-600/20"
                onClick={() => navigate("/applicant/jobDetails")}
                type="button"
              >
                View Details
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ApplicantDashboard;

import { useNavigate } from "react-router-dom";
import ApplicantNavbar from "./ApplicantNavbar";

const stats = [
  { label: "Applied Jobs", value: "12", helper: "4 active this week", color: "text-blue-600", background: "bg-blue-50" },
  { label: "Interviews", value: "3", helper: "2 scheduled soon", color: "text-amber-600", background: "bg-amber-50" },
  { label: "Offers", value: "1", helper: "Awaiting response", color: "text-emerald-600", background: "bg-emerald-50" },
];

const applications = [
  { job: "MERN Developer", company: "ABC Tech", date: "June 4, 2026", status: "Applied", style: "bg-emerald-100 text-emerald-700" },
  { job: "Frontend Engineer", company: "Pixel Labs", date: "June 2, 2026", status: "Interview", style: "bg-blue-100 text-blue-700" },
  { job: "React Developer", company: "XYZ Solutions", date: "May 30, 2026", status: "Review", style: "bg-amber-100 text-amber-700" },
];

const recommendedJobs = [
  { title: "MERN Stack Developer", company: "ABC Technologies", location: "Chennai", type: "Full Time", match: "92% Match" },
  { title: "React Developer", company: "XYZ Solutions", location: "Bangalore", type: "Remote", match: "88% Match" },
];

function ApplicantDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Dashboard"
        description="Track applications, discover matching roles, and keep your profile ready."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-7 text-white shadow-lg sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Mohan</h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            You have two interviews coming up. Review your applications and keep your resume current.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-white px-5 py-2.5 font-bold text-blue-700 transition hover:bg-blue-50"
              onClick={() => navigate("/applicant/joblisting")}
              type="button"
            >
              Browse Jobs
            </button>
            <button
              className="rounded-xl border border-white/40 px-5 py-2.5 font-bold text-white transition hover:bg-white/10"
              onClick={() => navigate("/applicant/resumeupload")}
              type="button"
            >
              Update Resume
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-3" aria-label="Application summary">
          {stats.map((stat) => (
            <article className="rounded-2xl bg-white p-5 shadow-sm" key={stat.label}>
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.background}`}>
                <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="font-bold">{stat.label}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.helper}</p>
            </article>
          ))}
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Profile</p>
                <h2 className="mt-1 text-xl font-bold">Profile Completion</h2>
              </div>
              <span className="font-bold text-blue-600">80%</span>
            </div>
            <div className="mt-5 h-2.5 rounded-full bg-slate-200">
              <div className="h-2.5 w-4/5 rounded-full bg-blue-600" />
            </div>
            <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <p>Personal information added</p>
              <p>Skills updated</p>
              <p className="text-amber-700">Resume needs update</p>
              <p className="text-amber-700">LinkedIn profile missing</p>
            </div>
            <button
              className="mt-5 text-sm font-bold text-blue-700 hover:text-blue-900"
              onClick={() => navigate("/applicant/profile")}
              type="button"
            >
              Complete profile
            </button>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Schedule</p>
            <h2 className="mt-1 text-xl font-bold">Upcoming Interviews</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">Frontend Developer</h3>
                    <p className="mt-1 text-sm text-slate-500">XYZ Solutions</p>
                  </div>
                  <span className="text-xs font-bold text-amber-700">June 12</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">10:00 AM · Video interview</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">React Developer</h3>
                    <p className="mt-1 text-sm text-slate-500">Pixel Labs</p>
                  </div>
                  <span className="text-xs font-bold text-blue-700">June 15</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">2:00 PM · Technical round</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-end justify-between border-b border-slate-200 p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Tracking</p>
              <h2 className="mt-1 text-xl font-bold">Recent Applications</h2>
            </div>
            <button className="text-sm font-bold text-blue-700" onClick={() => navigate("/applicant/jobDetails")} type="button">
              View details
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  {["Job", "Company", "Applied On", "Status"].map((heading) => (
                    <th className="px-6 py-3 font-semibold" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr className="transition hover:bg-slate-50" key={application.job}>
                    <td className="px-6 py-4 font-bold">{application.job}</td>
                    <td className="px-6 py-4 text-slate-600">{application.company}</td>
                    <td className="px-6 py-4 text-slate-600">{application.date}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${application.style}`}>{application.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">For you</p>
              <h2 className="mt-1 text-xl font-bold">Recommended Jobs</h2>
            </div>
            <button className="text-sm font-bold text-blue-700" onClick={() => navigate("/applicant/joblisting")} type="button">
              View all
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {recommendedJobs.map((job) => (
              <article className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" key={job.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="mt-1 text-slate-500">{job.company}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{job.match}</span>
                </div>
                <div className="mt-4 flex gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.type}</span>
                </div>
                <button
                  className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                  onClick={() => navigate("/applicant/jobDetails")}
                  type="button"
                >
                  View Details
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ApplicantDashboard;

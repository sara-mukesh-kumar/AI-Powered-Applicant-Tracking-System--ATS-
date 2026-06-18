import { useNavigate } from "react-router-dom";
import ApplicantNavbar from "./ApplicantNavbar";

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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Dashboard"
        description="Track applications, discover matching roles, and keep your profile ready."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-7 text-white shadow-lg sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{user.name || "Applicant"}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            Build your profile, discover matching roles, and track your applications here.
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
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Performance</p>
            <h2 className="mt-1 text-xl font-bold">Profile Views</h2>
            <div className="mt-6">
              <div className="flex items-end gap-1.5">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-10 w-6 bg-blue-200 rounded-sm" title="Mon: 4 views"></div>
                  <span className="text-xs text-slate-500">Mon</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-12 w-6 bg-blue-300 rounded-sm" title="Tue: 6 views"></div>
                  <span className="text-xs text-slate-500">Tue</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-8 w-6 bg-blue-200 rounded-sm" title="Wed: 3 views"></div>
                  <span className="text-xs text-slate-500">Wed</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-16 w-6 bg-blue-500 rounded-sm" title="Thu: 8 views"></div>
                  <span className="text-xs text-slate-500">Thu</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-14 w-6 bg-blue-400 rounded-sm" title="Fri: 7 views"></div>
                  <span className="text-xs text-slate-500">Fri</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-12 w-6 bg-blue-300 rounded-sm" title="Sat: 5 views"></div>
                  <span className="text-xs text-slate-500">Sat</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-10 w-6 bg-blue-200 rounded-sm" title="Sun: 4 views"></div>
                  <span className="text-xs text-slate-500">Sun</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-blue-600">37</p>
                  <p className="text-xs text-slate-500">Total Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">+15%</p>
                  <p className="text-xs text-slate-500">vs last week</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-2">
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

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Messages</p>
            <h2 className="mt-1 text-xl font-bold">Recent Inquiries</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center shrink-0 text-sm font-bold text-blue-700">
                  AB
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-900">ABC Technologies</p>
                  <p className="text-xs text-slate-600 truncate">Interested in your React skills...</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-700">
                  PL
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-900">Pixel Labs</p>
                  <p className="text-xs text-slate-600 truncate">Your profile matches our opening...</p>
                  <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center shrink-0 text-sm font-bold text-green-700">
                  TM
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-900">TechMart Solutions</p>
                  <p className="text-xs text-slate-600 truncate">Interview scheduled for next week</p>
                  <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
            <button
              className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-900"
              type="button"
            >
              View all messages
            </button>
          </article>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-end justify-between border-b border-slate-200 p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Tracking</p>
              <h2 className="mt-1 text-xl font-bold">Recent Applications</h2>
            </div>
            <button className="text-sm font-bold text-blue-700" onClick={() => navigate("/applicant/tracker")} type="button">
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

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        {/* Newsletter Section */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">Never Miss a Job Opportunity</h3>
                  <p className="mt-2 text-blue-100">Get personalized job recommendations delivered to your inbox</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="rounded-lg border-0 bg-white px-5 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-56"
                  />
                  <button
                    className="whitespace-nowrap rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition"
                    type="button"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 mb-10">
            {/* About Section */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                <span className="font-bold text-slate-900 text-lg">ATS Pro</span>
              </div>
              <p className="text-sm leading-6 text-slate-600 mb-5">
                The premier career platform connecting talented professionals with their dream jobs at leading companies worldwide.
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Follow us</p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-600 hover:text-blue-600 transition font-semibold text-sm">Facebook</a>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition font-semibold text-sm">LinkedIn</a>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition font-semibold text-sm">Twitter</a>
              </div>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">For Job Seekers</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Browse Jobs</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">My Applications</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Saved Jobs</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Career Advice</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Salary Guide</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Interview Tips</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Resume Builder</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Skill Assessment</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Company Reviews</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Market Trends</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Help Center</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Press & Media</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Partnerships</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Investor Relations</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Contact Us</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                  <a href="mailto:support@atspro.in" className="text-slate-600 hover:text-blue-600 transition text-sm">
                    support@atspro.in
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:+919876543210" className="text-slate-600 hover:text-blue-600 transition text-sm">
                    +91 9876 543 210
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Office</p>
                  <p className="text-slate-600 text-sm">
                    Bangalore, Karnataka<br/>India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-600">
                © 2026 ATS Pro. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition font-medium">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition font-medium">
                  Cookie Policy
                </a>
                <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition font-medium">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ApplicantDashboard;

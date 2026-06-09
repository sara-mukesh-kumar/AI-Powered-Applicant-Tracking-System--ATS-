// ==========================================
// APPLICANT DASHBOARD PAGE
// AI-Powered Applicant Tracking System (ATS)
// ==========================================  

// ==========================================
// NAVIGATION MENU ITEMS
// ==========================================
  const navigationItems = ['Home', 'Jobs', 'Tracking', 'Profile']

// ==========================================
// DASHBOARD STATISTICS
// ==========================================
  const stats = [
    {
      label: 'Applied Jobs',
      value: '12',
      helper: '4 active this week',
      accent: 'border-blue-500 bg-blue-50 text-blue-700',
    },
    {
      label: 'Interviews',
      value: '3',
      helper: '2 scheduled soon',
      accent: 'border-amber-500 bg-amber-50 text-amber-700',
    },
    {
      label: 'Offers',
      value: '1',
      helper: 'Awaiting response',
      accent: 'border-emerald-500 bg-emerald-50 text-emerald-700',
    },
  ]  

// ==========================================
// QUICK ACTION BUTTONS
// ==========================================
  const quickActions = [
    { label: 'Browse Jobs', style: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300' },
    { label: 'Update Resume', style: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300' },
    { label: 'View Profile', style: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300' },
  ]

  const recentApplications = [
    {
      job: 'MERN Developer',
      company: 'ABC Tech',
      appliedOn: 'June 04, 2026',
      status: 'Applied',
      statusStyle: 'bg-emerald-100 text-emerald-700',
    },
    {
      job: 'Frontend Engineer',
      company: 'Pixel Labs',
      appliedOn: 'June 02, 2026',
      status: 'Interview',
      statusStyle: 'bg-blue-100 text-blue-700',
    },
    {
      job: 'React Developer',
      company: 'XYZ Solutions',
      appliedOn: 'May 30, 2026',
      status: 'Review',
      statusStyle: 'bg-amber-100 text-amber-700',
    },
  ]

  const recommendedJobs = [
    {
      title: 'MERN Stack Developer',
      company: 'ABC Technologies',
      location: 'Chennai',
      type: 'Full time',
      match: '92% match',
    },
    {
      title: 'React Developer',
      company: 'XYZ Solutions',
      location: 'Bangalore',
      type: 'Remote',
      match: '88% match',
    },
  ]
  
// ==========================================
// MAIN COMPONENT
// ========================================== 
  function ApplicantDashboard() {
    return (

      <div className="min-h-screen bg-slate-100 text-slate-900">
        <nav className="sticky top-0 z-20 border-b border-blue-500/20 bg-blue-700 text-white shadow-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
                Applicant
              </p>
              <h1 className="text-2xl font-bold">ATS Portal</h1>
            </div>

            <ul className="flex flex-wrap gap-2 text-sm font-medium sm:gap-5">
              {navigationItems.map((item) => (
                <li key={item}>
                  <a
                    className="rounded-full px-3 py-2 text-blue-50 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                    href={`#${item.toLowerCase()}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

{/* //==========================================
//WELCOME BANNER SECTION
//========================================== */}
        <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <section
            className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl"
            id="home"
          >
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
                Welcome back
              </p>
              <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-5xl">Mohan</h2>
              <p className="max-w-2xl text-base text-blue-100 sm:text-lg">
                Track your applications, explore matching opportunities, and keep your candidate
                profile ready for recruiters.
              </p>
            </div>
          </section>

{/* //==========================================
//APPLICATION SUMMARY CARDS
//========================================== */}
          <section className="mb-8 grid gap-4 md:grid-cols-3" aria-label="Application summary">
            {stats.map((stat) => (
              <article
                className={`rounded-2xl border-l-4 p-5 shadow-sm ${stat.accent}`}
                key={stat.label}
              >
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <strong className="text-4xl font-bold">{stat.value}</strong>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                    {stat.helper}
                  </span>
                </div>
              </article>
            ))}
          </section>

{/* //==========================================
//QUICK ACTIONS SECTION
//==========================================  */}
          <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm" aria-labelledby="actions-title">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Next steps
                </p>
                <h2 className="text-xl font-bold" id="actions-title">
                  Quick Actions
                </h2>
              </div>
              <p className="text-sm text-slate-500">Keep your application journey moving.</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <button
                  className={`rounded-xl px-5 py-2.5 font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 ${action.style}`}
                  key={action.label}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </section>

{/* //==========================================
//PROFILE COMPLETION SECTION
//==========================================  */}

    <section className="mb-8 grid gap-4 lg:grid-cols-2">

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Profile Completion</h2>
          <span className="font-bold text-blue-600">80%</span>
        </div>

    <div className="h-3 w-full rounded-full bg-slate-200">
      <div className="h-3 w-4/5 rounded-full bg-blue-600"></div>
    </div>

    <ul className="mt-4 space-y-2 text-sm text-slate-600">
      <li>✅ Personal Information Added</li>
      <li>✅ Skills Updated</li>
      <li>⚠ Resume Needs Update</li>
      <li>⚠ LinkedIn Profile Missing</li>
    </ul>

      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Job Search</h2>

    <input
      type="text"
      placeholder="Search jobs, companies, skills..."
      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
    />

    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">React</span>
      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">MERN</span>
      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">Remote</span>
      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">Chennai</span>
    </div>

      </div>

    </section>

  {/* Upcoming Interviews + Notifications */}

  <section className="mb-8 grid gap-4 lg:grid-cols-2">

    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">
        Upcoming Interviews
      </h2>

  <div className="space-y-4">

    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="font-bold">Frontend Developer</h3>
      <p className="text-slate-600">XYZ Solutions</p>
      <p className="text-sm text-slate-500">
        June 12, 2026 • 10:00 AM
      </p>
    </div>

    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h3 className="font-bold">React Developer</h3>
      <p className="text-slate-600">Pixel Labs</p>
      <p className="text-sm text-slate-500">
        June 15, 2026 • 2:00 PM
      </p>
    </div>

  </div>

    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">
        Notifications
      </h2>

  <div className="space-y-3">

    <div className="rounded-xl bg-green-50 p-3">
      🎉 Your application for MERN Developer has been shortlisted.
    </div>

    <div className="rounded-xl bg-blue-50 p-3">
      📅 Interview scheduled with XYZ Solutions.
    </div>

    <div className="rounded-xl bg-purple-50 p-3">
      🚀 New jobs matching your profile are available.
    </div>

  </div>

    </div>

  </section>


          {/* Application Tracker */}
          <section
            className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm"
            id="tracking"
            aria-labelledby="applications-title"
          >
            <div className="border-b border-slate-200 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Application tracker
              </p>
              <h2 className="text-xl font-bold" id="applications-title">
                Recent Applications
              </h2>
            </div>

            {/* Application Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Job</th>
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Applied On</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((application) => (
                    <tr className="transition hover:bg-slate-50" key={`${application.job}-${application.company}`}>
                      <td className="px-5 py-4 font-semibold text-slate-900">{application.job}</td>
                      <td className="px-5 py-4 text-slate-600">{application.company}</td>
                      <td className="px-5 py-4 text-slate-600">{application.appliedOn}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${application.statusStyle}`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>


          {/* Recommended Jobs */}
          <section className="mb-8" id="jobs" aria-labelledby="jobs-title">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Recommended
                </p>
                <h2 className="text-xl font-bold" id="jobs-title">
                  Recommended Jobs
                </h2>
              </div>
              <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href="#jobs">
                View all jobs
              </a>
            </div>

            {/* Recommended Job Listings */}
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedJobs.map((job) => (
                <article className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" key={`${job.title}-${job.company}`}>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <p className="mt-1 text-slate-500">
                        {job.company} - {job.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {job.match}
                    </span>
                  </div>

                  {/* Job Tags */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {job.type}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      Immediate opening
                    </span>
                  </div>

                  <button
                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
    )
  }

  export default ApplicantDashboard



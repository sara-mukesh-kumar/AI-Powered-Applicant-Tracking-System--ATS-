import { useState } from 'react'

// ==========================================
// JOB LISTINGS DATA
// ==========================================
const jobsData = [
  {
    id: 1,
    title: 'MERN Stack Developer',
    company: 'ABC Technologies',
    location: 'Chennai',
    type: 'Full Time',
    match: '92% Match',
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'XYZ Solutions',
    location: 'Bangalore',
    type: 'Remote',
    match: '88% Match',
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Pixel Labs',
    location: 'Hyderabad',
    type: 'Full Time',
    match: '85% Match',
  },
  {
    id: 4,
    title: 'Node.js Developer',
    company: 'TechNova',
    location: 'Chennai',
    type: 'Hybrid',
    match: '81% Match',
  },
]

// ==========================================
// MAIN COMPONENT
// ==========================================
function JobListings() {
  const [search, setSearch] = useState('')

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-widest text-blue-100">
            Applicant Portal
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Job Listings
          </h1>

          <p className="mt-3 text-blue-100">
            Discover jobs that match your profile and skills.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* ==========================================
            SEARCH SECTION
        ========================================== */}
        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-xl font-bold">
            Search Jobs
          </h2>

          <input
            type="text"
            placeholder="Search by job title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
              React
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
              MERN
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
              Remote
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm">
              Chennai
            </span>
          </div>

        </section>

        {/* ==========================================
            JOB CARDS
        ========================================== */}
        <section>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Available Jobs
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {filteredJobs.length} Jobs Found
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-4 flex items-start justify-between">

                  <div>
                    <h3 className="text-lg font-bold">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-slate-500">
                      {job.company}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {job.match}
                  </span>

                </div>

                <div className="mb-4 flex flex-wrap gap-2">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                    📍 {job.location}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                    {job.type}
                  </span>

                </div>

                <div className="flex gap-3">

                  <button
                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Apply Now
                  </button>

                  <button
                    className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    View Details
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>

      </main>
    </div>
  )
}

export default JobListings
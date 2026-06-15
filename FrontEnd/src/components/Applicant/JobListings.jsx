import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicantApplicationModal from "./ApplicantApplyJob";
import ApplicantNavbar from "./ApplicantNavbar";

const jobsData = [
  { id: 1, title: "MERN Stack Developer", company: "ABC Technologies", location: "Chennai", type: "Full Time", match: "92% Match", posted: "2 days ago" },
  { id: 2, title: "React Developer", company: "XYZ Solutions", location: "Bangalore", type: "Remote", match: "88% Match", posted: "3 days ago" },
  { id: 3, title: "Frontend Engineer", company: "Pixel Labs", location: "Hyderabad", type: "Full Time", match: "85% Match", posted: "5 days ago" },
  { id: 4, title: "Node.js Developer", company: "TechNova", location: "Chennai", type: "Hybrid", match: "81% Match", posted: "1 week ago" },
];

const filters = ["All", "Remote", "Full Time", "Hybrid"];

function JobListings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobsData.filter((job) => {
    const query = search.toLowerCase();
    const matchesSearch = [job.title, job.company, job.location].some((value) =>
      value.toLowerCase().includes(query)
    );
    return matchesSearch && (activeFilter === "All" || job.type === activeFilter);
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Find Jobs"
        description="Discover roles that match your experience, skills, and preferences."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <label className="text-sm font-bold text-slate-700" htmlFor="job-search">
            Search opportunities
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            id="job-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, company, or location..."
            type="search"
            value={search}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Recommended</p>
              <h2 className="mt-1 text-2xl font-bold">Available Jobs</h2>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {filteredJobs.length} found
            </span>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <article
                  className="rounded-2xl border border-transparent bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
                  key={job.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <p className="mt-1 font-medium text-slate-500">{job.company}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {job.match}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.posted}</span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                      onClick={() => setSelectedJob(job)}
                      type="button"
                    >
                      Apply Now
                    </button>
                    <button
                      className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => navigate("/applicant/jobDetails")}
                      type="button"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">No jobs found</h3>
              <p className="mt-2 text-slate-500">Try another keyword or choose a different filter.</p>
            </div>
          )}
        </section>
      </main>
      {selectedJob && (
        <ApplicantApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

export default JobListings;

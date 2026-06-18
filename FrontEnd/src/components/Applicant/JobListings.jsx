import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApplicantApplicationModal from "./ApplicantApplyJob";
import ApplicantNavbar from "./ApplicantNavbar";

const filters = ["All", "Entry-Level", "Mid-Level", "Senior-Level", "Lead/Manager"];

const formatPostedDate = (dateValue) => {
  if (!dateValue) return "Recently posted";

  const postedDate = new Date(dateValue);
  if (Number.isNaN(postedDate.getTime())) return "Recently posted";

  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

const mapJobFromApi = (job) => ({
  id: job._id,
  title: job.title || "Untitled role",
  company: job.recruiterId?.name || "Recruiting Team",
  recruiterEmail: job.recruiterId?.email || "",
  location: "Location not specified",
  type: job.experienceLevel || "Experience not specified",
  match: "Open role",
  posted: formatPostedDate(job.createdAt),
  description: job.description || "",
  skills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
});

function JobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again to view available jobs.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        const response = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data.map(mapJobFromApi));
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load jobs from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();
      const matchesSearch = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...job.skills,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesSearch && (activeFilter === "All" || job.type === activeFilter);
    });
  }, [activeFilter, jobs, search]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Find Jobs"
        description="Discover roles that match your experience, skills, and preferences."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <label className="text-sm font-bold text-slate-700" htmlFor="job-search">
              Search opportunities
            </label>
            <button
              className="w-fit rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              onClick={() => navigate("/applicant/savedjobs")}
              type="button"
            >
              Saved Jobs
            </button>
          </div>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            id="job-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, recruiter, description, or skill..."
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
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Live jobs</p>
              <h2 className="mt-1 text-2xl font-bold">Available Jobs</h2>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {filteredJobs.length} found
            </span>
          </div>

          {isLoading && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Loading jobs...</h3>
              <p className="mt-2 text-slate-500">Fetching open roles from the database.</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              <h3 className="font-bold">Could not load jobs</h3>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredJobs.length > 0 && (
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
                      {job.recruiterEmail && (
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {job.recruiterEmail}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {job.match}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {job.description || "No job description added yet."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.posted}</span>
                  </div>

                  {job.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

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
                      onClick={() => navigate("/applicant/jobDetails", { state: { job } })}
                      type="button"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredJobs.length === 0 && (
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

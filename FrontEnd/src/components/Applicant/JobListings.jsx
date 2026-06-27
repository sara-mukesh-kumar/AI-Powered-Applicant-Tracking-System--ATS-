import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApplicantApplicationModal from "./ApplicantApplyJob";

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
  const [userProfile, setUserProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobsAndProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again to view available jobs.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        
        // 1. Fetch Profile
        try {
          const profileResponse = await axios.get("http://localhost:5000/api/applicant/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserProfile(profileResponse.data);
        } catch (profileErr) {
          console.error("Failed to load applicant profile for skill matching:", profileErr);
        }

        // 2. Fetch Jobs
        const response = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jobsList = response.data.jobs || [];
        setJobs(jobsList.map(mapJobFromApi));
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load jobs from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsAndProfile();
  }, []);

  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isCurrentlySaved = userProfile?.savedJobs?.includes(jobId);
    const method = isCurrentlySaved ? "delete" : "post";
    
    try {
      const res = await axios({
        method,
        url: `http://localhost:5000/api/applicant/save/${jobId}`,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        setUserProfile(prev => {
          if (!prev) return prev;
          const updatedSaved = isCurrentlySaved
            ? prev.savedJobs.filter(id => id !== jobId)
            : [...(prev.savedJobs || []), jobId];
          return { ...prev, savedJobs: updatedSaved };
        });
      }
    } catch (err) {
      console.error("Error toggling save job:", err);
    }
  };

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
    <div className="text-slate-900">
        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <label className="text-sm font-bold text-slate-700" htmlFor="job-search">
              Search opportunities
            </label>
            <button
              className="w-fit rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 cursor-pointer"
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
                className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
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
              {filteredJobs.map((job) => {
                const userSkills = userProfile?.skills || [];
                const requiredSkills = job.skills || [];
                const matchedSkills = requiredSkills.filter(skill =>
                  userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
                );
                const missingSkills = requiredSkills.filter(skill =>
                  !userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
                );
                const matchPct = requiredSkills.length > 0
                  ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                  : 60;

                const getMatchStyle = (pct) => {
                  if (pct >= 80) return "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-50";
                  if (pct >= 50) return "bg-amber-50 text-amber-700 border border-amber-100";
                  return "bg-slate-50 text-slate-500 border border-slate-100";
                };

                const isSaved = userProfile?.savedJobs?.includes(job.id);

                return (
                  <article
                    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 flex flex-col justify-between"
                    key={job.id}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug truncate">{job.title}</h3>
                          <p className="mt-1 text-xs font-bold text-slate-400 truncate">{job.company}</p>
                          {job.recruiterEmail && (
                            <p className="mt-0.5 text-[10px] font-semibold text-slate-400 truncate">
                              {job.recruiterEmail}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job.id);
                            }}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isSaved
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                            title={isSaved ? "Unsave job" : "Save job"}
                          >
                            {isSaved ? "⭐" : "☆"}
                          </button>
                          <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold ${getMatchStyle(matchPct)}`}>
                            {matchPct}% Match
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500 font-medium">
                        {job.description || "No job description added yet."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5">{job.location || "Remote"}</span>
                        <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5">{job.type}</span>
                        <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5">{job.posted}</span>
                      </div>

                      {requiredSkills.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Required Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {matchedSkills.map((skill) => (
                              <span
                                className="rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700"
                                key={skill}
                              >
                                ✓ {skill}
                              </span>
                            ))}
                            {missingSkills.slice(0, 4).map((skill) => (
                              <span
                                className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-400"
                                key={skill}
                              >
                                {skill}
                              </span>
                            ))}
                            {missingSkills.length > 4 && (
                              <span className="text-[9px] font-bold text-slate-400 self-center">
                                +{missingSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/5 hover:shadow-indigo-600/10 active:scale-[0.98] transition-all cursor-pointer animate-fade-in"
                        onClick={() => setSelectedJob(job)}
                        type="button"
                      >
                        Apply Now
                      </button>
                      <button
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-600 active:scale-[0.98] transition-all cursor-pointer"
                        onClick={() => navigate("/applicant/jobDetails", { state: { job } })}
                        type="button"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!isLoading && !error && filteredJobs.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">No jobs found</h3>
              <p className="mt-2 text-slate-500">Try another keyword or choose a different filter.</p>
            </div>
          )}
        </section>
      {selectedJob && (
        <ApplicantApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

export default JobListings;

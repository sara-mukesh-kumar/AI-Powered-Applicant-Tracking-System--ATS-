import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicantNavbar from "./ApplicantNavbar";

const initialSavedJobs = [
  {
    id: "saved-1",
    title: "React Developer",
    company: "XYZ Solutions",
    location: "Bangalore",
    type: "Remote",
    savedOn: "Jun 14, 2026",
    skills: ["React", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "saved-2",
    title: "MERN Stack Developer",
    company: "ABC Technologies",
    location: "Chennai",
    type: "Full Time",
    savedOn: "Jun 12, 2026",
    skills: ["MongoDB", "Express.js", "React", "Node.js"],
  },
  {
    id: "saved-3",
    title: "Frontend Engineer",
    company: "Pixel Labs",
    location: "Hyderabad",
    type: "Hybrid",
    savedOn: "Jun 09, 2026",
    skills: ["TypeScript", "React", "UI Systems"],
  },
];

function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase();
    return savedJobs.filter((job) =>
      [job.title, job.company, job.location, job.type, ...job.skills].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [savedJobs, search]);

  const removeSavedJob = (jobId) => {
    setSavedJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Saved Jobs"
        description="Review bookmarked roles and apply when you are ready."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Bookmarks</p>
              <h2 className="mt-1 text-2xl font-bold">Saved Opportunities</h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep promising roles in one place before applying.
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {savedJobs.length} saved
            </span>
          </div>

          <label className="mt-6 block text-sm font-bold text-slate-700" htmlFor="saved-job-search">
            Search saved jobs
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            id="saved-job-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role, company, location, or skill..."
            type="search"
            value={search}
          />
        </section>

        {filteredJobs.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <article className="rounded-2xl bg-white p-6 shadow-sm" key={job.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="mt-1 font-medium text-slate-500">{job.company}</p>
                    <p className="mt-2 text-sm font-semibold text-blue-600">Saved {job.savedOn}</p>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                    {job.type}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
                  {job.skills.map((skill) => (
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                    onClick={() => navigate("/applicant/jobDetails", { state: { job } })}
                    type="button"
                  >
                    Apply Now
                  </button>
                  <button
                    className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                    onClick={() => removeSavedJob(job.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold">No saved jobs found</h3>
            <p className="mt-2 text-slate-500">
              Save roles from job search to build your shortlist.
            </p>
            <button
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              onClick={() => navigate("/applicant/joblisting")}
              type="button"
            >
              Browse Jobs
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default SavedJobs;

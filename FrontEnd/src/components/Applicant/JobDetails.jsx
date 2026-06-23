import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicantApplicationModal from "./ApplicantApplyJob";

const job = {
  title: "MERN Stack Developer",
  company: "ABC Technologies",
  location: "Chennai",
  type: "Full Time",
  salary: "INR 6 LPA - 10 LPA",
  experience: "1 - 3 Years",
  match: "92% Match",
  postedDate: "2 days ago",
  applicants: 34,
  skills: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript"],
  description:
    "We are looking for a passionate MERN Stack Developer who can build scalable web applications and collaborate with cross-functional teams.",
  responsibilities: [
    "Develop modern web applications using React and Node.js",
    "Build REST APIs and backend services",
    "Work with MongoDB databases",
    "Collaborate with UI and UX designers",
    "Maintain code quality and performance",
  ],
  requirements: [
    "Strong knowledge of JavaScript",
    "Experience with React.js",
    "Knowledge of Node.js and Express",
    "Basic MongoDB understanding",
    "Good communication skills",
  ],
};

function DetailList({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li className="flex gap-3 text-slate-600" key={item}>
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function JobDetails() {
  const navigate = useNavigate();
  const [applicationOpen, setApplicationOpen] = useState(false);

  return (
    <div className="text-slate-900">
        <button
          className="mb-5 text-sm font-bold text-blue-700 transition hover:text-blue-900"
          onClick={() => navigate("/applicant/joblisting")}
          type="button"
        >
          Back to job listings
        </button>

        <section className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">{job.company}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{job.title}</h2>
              <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                {[job.location, job.type, job.salary, job.experience].map((item) => (
                  <span className="rounded-full bg-white px-4 py-2 shadow-sm" key={item}>{item}</span>
                ))}
              </div>
            </div>
            <span className="w-fit rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white">{job.match}</span>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Posted</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{job.postedDate}</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Applicants</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{job.applicants}</p>
          </article>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Overview</p>
              <h3 className="mt-1 text-xl font-bold">Job Description</h3>
              <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Responsibilities</h3>
              <DetailList items={job.responsibilities} />
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Requirements</h3>
              <DetailList items={job.requirements} />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Required Skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h3 className="font-bold">Interested in this role?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Your profile is a strong match for this opportunity.</p>
              <button
                className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                onClick={() => setApplicationOpen(true)}
                type="button"
              >
                Apply Now
              </button>
              <button className="mt-3 w-full rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100" type="button">
                Save Job
              </button>
            </section>
          </aside>
        </div>
      {applicationOpen && (
        <ApplicantApplicationModal job={job} onClose={() => setApplicationOpen(false)} />
      )}
    </div>
  );
}

export default JobDetails;

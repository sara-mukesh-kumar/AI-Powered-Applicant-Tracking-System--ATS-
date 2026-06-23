import { useMemo, useState } from "react";

const applications = [
  {
    role: "MERN Stack Developer",
    company: "ABC Technologies",
    location: "Chennai",
    date: "Jun 10, 2026",
    status: "Under Review",
    stage: "under-review",
    nextStep: "Recruiter screening pending",
    color: "bg-blue-50 text-blue-700",
  },
  {
    role: "Frontend Developer",
    company: "XYZ Solutions",
    location: "Bangalore",
    date: "Jun 08, 2026",
    status: "Interviewing",
    stage: "interviewing",
    nextStep: "Technical round on Jun 20",
    color: "bg-amber-50 text-amber-700",
  },
  {
    role: "React Developer",
    company: "Pixel Labs",
    location: "Remote",
    date: "Jun 05, 2026",
    status: "Offered",
    stage: "offered",
    nextStep: "Review offer letter",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    role: "Node.js Developer",
    company: "TechNova",
    location: "Hyderabad",
    date: "May 29, 2026",
    status: "Archived",
    stage: "archived",
    nextStep: "No action needed",
    color: "bg-slate-100 text-slate-600",
  },
];

const tabs = [
  { label: "All Applications", value: "all" },
  { label: "Under Review", value: "under-review" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Offered", value: "offered" },
  { label: "Archived", value: "archived" },
];

function ApplicationTracker() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredApplications = useMemo(() => {
    if (activeTab === "all") return applications;
    return applications.filter((application) => application.stage === activeTab);
  }, [activeTab]);

  const summary = useMemo(
    () => [
      ["4", "Total applications", "text-blue-600", "bg-blue-50"],
      ["1", "Interviews", "text-amber-600", "bg-amber-50"],
      ["1", "Offer received", "text-emerald-600", "bg-emerald-50"],
    ],
    []
  );

  return (
    <div className="text-slate-900">
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          {summary.map(([value, label, textColor, background]) => (
            <article className="rounded-2xl bg-white p-5 shadow-sm" key={label}>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${background}`}>
                <strong className={`text-xl ${textColor}`}>{value}</strong>
              </div>
              <p className="font-bold text-slate-900">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Updated today</p>
            </article>
          ))}
        </section>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Pipeline</p>
              <h2 className="mt-1 text-2xl font-bold">Application History</h2>
              <p className="mt-2 text-sm text-slate-500">
                Track each job from application to final decision.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {filteredApplications.map((application) => (
              <article
                className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                key={`${application.role}-${application.company}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold">{application.role}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${application.color}`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {application.company} - {application.location} - Applied {application.date}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {application.nextStep}
                  </p>
                </div>
                <button
                  className="w-fit rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  type="button"
                >
                  View Details
                </button>
              </article>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-lg font-bold">No applications in this stage</h3>
              <p className="mt-2 text-slate-500">Switch tabs to review another status.</p>
            </div>
          )}
        </section>
    </div>
  );
}

export default ApplicationTracker;

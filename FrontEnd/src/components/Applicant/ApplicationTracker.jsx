import ApplicantNavbar from "./ApplicantNavbar";

const applications = [
  { role: "MERN Stack Developer", company: "ABC Technologies", date: "June 4, 2026", status: "Interview", color: "bg-blue-100 text-blue-700" },
  { role: "React Developer", company: "XYZ Solutions", date: "June 2, 2026", status: "Review", color: "bg-amber-100 text-amber-700" },
  { role: "Frontend Engineer", company: "Pixel Labs", date: "May 30, 2026", status: "Applied", color: "bg-emerald-100 text-emerald-700" },
];

function ApplicationTracker() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Application Tracker"
        description="Follow every application from submission to decision."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          {[["12", "Total applications"], ["3", "Interviews"], ["1", "Offer received"]].map(
            ([value, label]) => (
              <article className="rounded-2xl bg-white p-5 shadow-sm" key={label}>
                <strong className="text-3xl text-blue-600">{value}</strong>
                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
              </article>
            )
          )}
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Progress</p>
            <h2 className="mt-1 text-xl font-bold">Recent Applications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {applications.map((application) => (
              <article
                className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                key={`${application.role}-${application.company}`}
              >
                <div>
                  <h3 className="font-bold">{application.role}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {application.company} · Applied {application.date}
                  </p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${application.color}`}>
                  {application.status}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ApplicationTracker;

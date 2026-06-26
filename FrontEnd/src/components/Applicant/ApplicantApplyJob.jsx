import { useState } from "react";

function ApplicantApplicationModal({ job, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const savedProfile = user._id
    ? JSON.parse(localStorage.getItem(`applicantProfile:${user._id}`) || "null")
    : null;
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
 
  const submitApplication = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("token");
    const jobId = job.id || job._id;

    try {
      const res = await fetch(`http://localhost:5000/api/applicant/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errJson = await res.json();
        setError(errJson.message || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while applying for job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-labelledby="application-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
              OK
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-wider text-emerald-600">
              Application submitted
            </p>
            <h2 className="mt-2 text-2xl font-bold" id="application-title">
              You applied for {job.title}
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Your profile and current resume were sent to {job.company}. You can follow the
              progress from your application tracker.
            </p>
            <button
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              onClick={onClose}
              type="button"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submitApplication}>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Quick application
                </p>
                <h2 className="mt-2 text-2xl font-bold" id="application-title">
                  Apply for {job.title}
                </h2>
                <p className="mt-1 text-slate-500">{job.company}</p>
              </div>
              <button
                aria-label="Close application"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 transition hover:bg-slate-200"
                onClick={onClose}
                type="button"
              >
                X
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4">
              <p className="font-bold text-slate-800">{savedProfile?.name || user.name || "Applicant"}</p>
              <p className="mt-1 text-sm text-slate-600">{savedProfile?.role || "Applicant"}</p>
              <p className="mt-2 text-xs font-semibold text-blue-700">
                Your saved profile and latest resume will be included.
              </p>
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="application-note">
              Note to recruiter <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              id="application-note"
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Share why this role interests you..."
              value={note}
            />
            <p className="mt-1 text-right text-xs text-slate-400">{note.length}/500</p>

            {error && (
              <p className="mt-4 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-150">{error}</p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-slate-350 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplicantApplicationModal;

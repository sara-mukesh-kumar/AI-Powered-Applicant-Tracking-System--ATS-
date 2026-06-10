import { useRef, useState } from "react";
// import ApplicantNavbar from "./ApplicantNavbar";

function ResumeUpload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const selectFile = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="Resume"
        description="Upload a clear, current resume to improve your job matches."
      />

      <main className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Document</p>
            <h2 className="mt-1 text-2xl font-bold">Upload Your Resume</h2>
            <p className="mt-2 text-slate-500">PDF or DOCX, up to 5 MB.</p>
          </div>

          <button
            className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              +
            </span>
            <span className="text-lg font-bold text-slate-800">Choose a resume</span>
            <span className="mt-2 text-sm text-slate-500">Click to browse files from your device</span>
          </button>
          <input
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={selectFile}
            ref={inputRef}
            type="file"
          />

          {file && (
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-800">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB ready to upload
                </p>
              </div>
              <button
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                type="button"
              >
                Upload Resume
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Use keywords", "Match skills and terms from the job description."],
            ["Keep it concise", "Highlight your most relevant recent experience."],
            ["Check details", "Review dates, contact information, and links."],
          ].map(([title, text], index) => (
            <article className="rounded-2xl bg-white p-5 shadow-sm" key={title}>
              <span className="text-sm font-bold text-blue-600">0{index + 1}</span>
              <h3 className="mt-2 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ResumeUpload;

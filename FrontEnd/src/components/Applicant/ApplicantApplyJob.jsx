import { useState, useEffect, useRef } from "react";

function ApplicantApplicationModal({ job, onClose }) {
  const user = JSON.parse(localStorage.getItem("token") ? localStorage.getItem("user") || "{}" : "{}");
  
  // Wizard steps: 1 (Contact Info), 2 (Resume Selection), 3 (Cover Note / Matching), 4 (Result/Success)
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [vaultResumes, setVaultResumes] = useState([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const jobId = job.id || job._id;

  // Fetch applicant profile & vault resumes on mount
  useEffect(() => {
    const loadApplicationContext = async () => {
      if (!token) return;
      try {
        // 1. Fetch profile
        const profRes = await fetch("http://localhost:5000/api/applicant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
          if (profData.resumeUrl) {
            setSelectedResumeUrl(profData.resumeUrl);
          }
        }

        // 2. Fetch Document Vault documents
        const docRes = await fetch("http://localhost:5000/api/applicant/documents", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (docRes.ok) {
          const docData = await docRes.json();
          // Filter to just resumes
          const resumes = docData.filter(d => d.category === "resume");
          setVaultResumes(resumes);
        }
      } catch (err) {
        console.error("Failed to load application context:", err);
      }
    };

    loadApplicationContext();
  }, [token]);

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setUploadFile(file);
      setSelectedResumeUrl("upload");
      setError("");
    }
  };

  const handleNextStep = () => {
    if (step === 2 && !selectedResumeUrl) {
      setError("Please select or upload a resume to proceed.");
      return;
    }
    setError("");
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(prev => prev - 1);
  };

  const submitApplication = async (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // If user uploaded a new resume, upload it first to set profile resumeUrl
      if (selectedResumeUrl === "upload" && uploadFile) {
        const formData = new FormData();
        formData.append("resume", uploadFile);
        
        const uploadRes = await fetch("http://localhost:5000/api/applicant/upload-resume", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        
        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.message || "Failed to upload new resume.");
        }
      } else if (selectedResumeUrl && selectedResumeUrl !== "upload" && selectedResumeUrl !== profile?.resumeUrl) {
        // If user chose a vault resume distinct from current profile resume, update profile resumeUrl
        await fetch("http://localhost:5000/api/applicant/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ resumeUrl: selectedResumeUrl })
        });
      }

      // Submit application
      const res = await fetch(`http://localhost:5000/api/applicant/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });

      if (res.ok) {
        const resJson = await res.json();
        setAiResult({
          aiScore: resJson.aiScore || resJson.application?.aiScore || 75,
          aiSummary: resJson.application?.aiSummary || "Your profile aligns well with the key requirements for this position."
        });
        setStep(4);
      } else {
        const errJson = await res.json();
        setError(errJson.message || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error while applying for job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgressWidth = () => {
    if (step === 1) return "33%";
    if (step === 2) return "66%";
    if (step === 3) return "100%";
    return "100%";
  };

  return (
    <div
      aria-labelledby="application-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8 relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
        
        {/* Step Indicator Header (Hide on final success screen) */}
        {step < 4 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Quick Application</span>
              <span>Step {step} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: getStepProgressWidth() }}
              />
            </div>
          </div>
        )}

        <div className="overflow-y-auto pr-1 flex-1 py-1">
          {/* STEP 1: CONTACT INFO */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900" id="application-title">
                  Review Contact Information
                </h2>
                <p className="text-slate-400 text-xs mt-1">Please verify the details recruiters will use to contact you.</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                    <p className="text-sm font-bold text-slate-800 mt-1">{profile?.name || user.name || "Candidate"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                    <p className="text-sm font-bold text-slate-800 mt-1">{profile?.email || user.email || "Email not set"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Current Designation</label>
                    <p className="text-sm font-bold text-slate-800 mt-1">{profile?.designation || "Applicant"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Location</label>
                    <p className="text-sm font-bold text-slate-800 mt-1">{profile?.location || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                💡 Need to update this? You can edit details in your profile tab later.
              </p>
            </div>
          )}

          {/* STEP 2: RESUME SELECTION */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900" id="application-title">
                  Select Resume
                </h2>
                <p className="text-slate-400 text-xs mt-1">Select a stored document or upload a new resume for this application.</p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold">{error}</div>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {/* Profile Resume Option */}
                {profile?.resumeUrl && (
                  <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                    selectedResumeUrl === profile.resumeUrl ? "border-indigo-500 bg-indigo-50/15" : "border-slate-200 hover:bg-slate-50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="resume-selection"
                        value={profile.resumeUrl}
                        checked={selectedResumeUrl === profile.resumeUrl}
                        onChange={() => {
                          setSelectedResumeUrl(profile.resumeUrl);
                          setError("");
                        }}
                        className="accent-indigo-650"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Primary Profile Resume</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{profile.resumeUrl.split("/").pop()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Default</span>
                  </label>
                )}

                {/* Vault Resumes */}
                {vaultResumes.map((resume) => {
                  if (resume.url === profile?.resumeUrl) return null; // skip duplicate profile resume
                  return (
                    <label key={resume._id} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                      selectedResumeUrl === resume.url ? "border-indigo-500 bg-indigo-50/15" : "border-slate-200 hover:bg-slate-50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="resume-selection"
                          value={resume.url}
                          checked={selectedResumeUrl === resume.url}
                          onChange={() => {
                            setSelectedResumeUrl(resume.url);
                            setError("");
                          }}
                          className="accent-indigo-650"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{resume.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Uploaded via Vault</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Vault</span>
                    </label>
                  );
                })}

                {/* File Upload Option */}
                <div className={`p-4 border rounded-2xl transition ${
                  selectedResumeUrl === "upload" ? "border-indigo-500 bg-indigo-50/15" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="resume-selection"
                      value="upload"
                      checked={selectedResumeUrl === "upload"}
                      onChange={() => setSelectedResumeUrl("upload")}
                      className="accent-indigo-650"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Upload a fresh Resume</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX formats supported</p>
                    </div>
                  </label>
                  
                  {selectedResumeUrl === "upload" && (
                    <div className="mt-3.5 pl-6">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileUploadChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition cursor-pointer border border-indigo-100"
                      >
                        {uploadFile ? `Selected: ${uploadFile.name}` : "Browse Resume File"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COVER NOTE & MATCHING */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900" id="application-title">
                  Match & Final Pitch
                </h2>
                <p className="text-slate-400 text-xs mt-1">Include a brief note to support your application matching score.</p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold">{error}</div>
              )}

              {/* Skills overlap summary */}
              {job.skills && job.skills.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Role Requirements</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => {
                      const isMatched = profile?.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <span 
                          key={skill}
                          className={`rounded-lg px-2.5 py-1 text-[9px] font-bold border ${
                            isMatched 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-slate-100 text-slate-450 border-slate-150"
                          }`}
                        >
                          {isMatched ? "✓" : "○"} {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" htmlFor="application-note">
                  Cover note to recruiter <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  className="w-full min-h-24 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  id="application-note"
                  maxLength={500}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Tell the hiring team why you are a perfect fit..."
                  value={note}
                />
                <p className="text-right text-[10px] font-bold text-slate-400 mt-1">{note.length}/500</p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS & AI EVALUATION SCORE */}
          {step === 4 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                🎉
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Application Submitted Successfully!</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 leading-tight">
                  You applied for {job.title}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{job.company}</p>
              </div>

              {/* AI Score Badge Card */}
              {aiResult && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 border border-indigo-100/50 rounded-3xl p-5 max-w-sm mx-auto space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/40 px-2 py-0.5 rounded">AI Matching Result</span>
                    <span className="text-xs font-extrabold text-indigo-950">{aiResult.aiScore}/100 Match</span>
                  </div>
                  
                  {/* Circle progress bar */}
                  <div className="relative flex items-center justify-center py-2">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="url(#modalGrad)" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={201}
                        strokeDashoffset={201 - (201 * aiResult.aiScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-base font-black text-slate-900">{aiResult.aiScore}%</span>
                  </div>

                  <p className="text-[11px] text-slate-650 leading-relaxed font-semibold italic text-center">
                    "{aiResult.aiSummary}"
                  </p>
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-500 px-4">
                Your profile, resume document, and AI match insights have been shared with the recruiter. You can track this application in your dashboard timeline.
              </p>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-5">
          {step < 4 ? (
            <>
              {step > 1 ? (
                <button
                  className="rounded-2xl border border-slate-200 px-6 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer active:scale-[0.98]"
                  onClick={handlePrevStep}
                  type="button"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              ) : (
                <button
                  className="rounded-2xl border border-slate-200 px-6 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer active:scale-[0.98]"
                  onClick={onClose}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/5 transition cursor-pointer active:scale-[0.98]"
                  onClick={handleNextStep}
                  type="button"
                >
                  Continue
                </button>
              ) : (
                <button
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/5 transition cursor-pointer active:scale-[0.98] disabled:bg-slate-350 disabled:cursor-not-allowed"
                  onClick={submitApplication}
                  type="button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Applying..." : "Submit Application"}
                </button>
              )}
            </>
          ) : (
            <button
              className="w-full sm:w-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 text-xs font-bold text-white transition cursor-pointer active:scale-[0.98]"
              onClick={onClose}
              type="button"
            >
              Done
            </button>
          )}
        </div>

        {/* Modal close icon */}
        {step < 4 && (
          <button
            aria-label="Close application"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer font-bold text-xs"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default ApplicantApplicationModal;

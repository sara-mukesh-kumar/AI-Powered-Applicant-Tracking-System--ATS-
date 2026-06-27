import { useState, useEffect, useRef } from "react";

function ApplicantProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingField, setEditingField] = useState(null); // 'profile' or null

  // Draft states for new additions
  const [newExp, setNewExp] = useState({ company: "", title: "", duration: "", description: "" });
  const [newEdu, setNewEdu] = useState({ degree: "", school: "", duration: "" });
  const [skillInput, setSkillInput] = useState("");

  // Edit states for details
  const [profileDraft, setProfileDraft] = useState({});

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      await Promise.resolve();
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/applicant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setProfileDraft(data);
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdateProfile = async (updatedFields) => {
    try {
      setError("");
      const res = await fetch("http://localhost:5000/api/applicant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileDraft(data);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle Open to Work
  const handleToggleOpenToWork = () => {
    const currentPrivacy = profile?.privacy || {};
    const newOpenToWork = !(currentPrivacy.openToWork ?? true);
    handleUpdateProfile({
      privacy: {
        ...currentPrivacy,
        openToWork: newOpenToWork
      }
    });
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/api/applicant/upload-resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setProfileDraft(data.user);
        setSuccess("Resume parsed successfully! Skills extracted.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errJson = await res.json();
        throw new Error(errJson.message || "Failed to upload resume");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = profile?.skills || [];
      if (!currentSkills.includes(skillInput.trim())) {
        const updated = [...currentSkills, skillInput.trim()];
        handleUpdateProfile({ skills: updated });
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = (profile?.skills || []).filter(s => s !== skillToRemove);
    handleUpdateProfile({ skills: updated });
  };

  // Experience handlers
  const handleAddExperience = () => {
    if (!newExp.company || !newExp.title) return;
    const currentExp = profile?.experience || [];
    const updated = [...currentExp, newExp];
    handleUpdateProfile({ experience: updated });
    setNewExp({ company: "", title: "", duration: "", description: "" });
  };

  const handleRemoveExperience = (idx) => {
    const updated = (profile?.experience || []).filter((_, i) => i !== idx);
    handleUpdateProfile({ experience: updated });
  };

  // Education handlers
  const handleAddEducation = () => {
    if (!newEdu.degree || !newEdu.school) return;
    const currentEdu = profile?.education || [];
    const updated = [...currentEdu, newEdu];
    handleUpdateProfile({ education: updated });
    setNewEdu({ degree: "", school: "", duration: "" });
  };

  const handleRemoveEducation = (idx) => {
    const updated = (profile?.education || []).filter((_, i) => i !== idx);
    handleUpdateProfile({ education: updated });
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-indigo-650 font-bold">Loading candidate profile...</div>
      </div>
    );
  }

  const initials = (profile?.name || "MK")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in text-slate-900">

      {/* Alert overlays */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl z-50 text-sm font-bold border border-emerald-500/20">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-6 right-6 bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-xl z-50 text-sm font-bold border border-rose-500/20">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
        <div className="h-40 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-950" />

        {/* Open to Work Toggle Header */}
        <div className="absolute right-6 top-6 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl">
          <span className="text-xs font-black uppercase text-white tracking-wider">Open To Work</span>
          <button
            onClick={handleToggleOpenToWork}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none ${profile?.privacy?.openToWork ?? true ? "bg-emerald-500" : "bg-slate-500"
              }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${profile?.privacy?.openToWork ?? true ? "translate-x-5" : "translate-x-0"
              }`} />
          </button>
        </div>

        <div className="px-6 pb-8 sm:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="-mt-16 flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-indigo-50 text-4xl font-black text-indigo-700 shadow-md">
              {initials}
            </div>
            <div className="pt-2 sm:pt-4">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{profile?.name}</h2>
              <p className="mt-1 text-base font-semibold text-slate-500">{profile?.designation || "Applicant"}</p>
              <p className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                📍 {profile?.location || "Location not added"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditingField(editingField === "profile" ? null : "profile")}
            className="rounded-2xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 font-bold px-6 py-3 text-xs tracking-wider transition cursor-pointer"
          >
            {editingField === "profile" ? "Cancel Edit" : "Edit Personal Info"}
          </button>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side Info / Resume Upload & Skills */}
        <div className="space-y-6">

          {/* Resume Upload parsing zone */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            {uploading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-pulse">
                <span className="text-4xl mb-3">🧠</span>
                <p className="text-sm font-extrabold text-indigo-950">AI Parsing Engine Active</p>
                <p className="text-xs text-slate-400 mt-1">Extracting skills & experience values from PDF...</p>
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900 mb-2">Resume Parsing</h3>
            <p className="text-xs text-slate-400 mb-4">Drag and drop or select your resume file. AI will automatically scan and fill in key details.</p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-6 text-center transition cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleResumeUpload}
              />
              <span className="text-2xl block mb-2">📄</span>
              <p className="text-xs font-bold text-slate-700">Choose resume file</p>
              <p className="text-[10px] text-slate-400 mt-1">PDF or Word files up to 5MB</p>
            </div>
            {profile?.resumeUrl && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 truncate max-w-[70%]">📄 {profile.resumeUrl.split("/").pop()}</span>
                <span className="text-[10px] font-black text-emerald-600 bg-white border border-emerald-200 px-2 py-0.5 rounded">Uploaded</span>
              </div>
            )}
          </div>

          {/* Contact details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Personal details</h3>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-slate-800 mt-1 break-all">{profile?.email}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{profile?.location || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Skills Tags block (Moved here for grid balance) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || []).map((skill, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/60 rounded-full px-3 py-1.5 text-xs font-bold text-indigo-700">
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600 text-[10px] cursor-pointer">✕</button>
                </div>
              ))}
            </div>
            <div className="max-w-xs mt-3">
              <input
                type="text"
                placeholder="Type a skill and hit Enter"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
            </div>
          </div>

        </div>

        {/* Right Side Timeline Editors */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile form popup inline edit */}
          {editingField === "profile" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Update Profile details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                    value={profileDraft.name || ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase">Designation</label>
                  <input
                    type="text"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                    value={profileDraft.designation || ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, designation: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Location</label>
                  <input
                    type="text"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                    value={profileDraft.location || ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, location: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Summary</label>
                  <textarea
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition min-h-20"
                    value={profileDraft.summary || ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, summary: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  handleUpdateProfile(profileDraft);
                  setEditingField(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-5 rounded-xl cursor-pointer transition active:scale-[0.98]"
              >
                Save Details
              </button>
            </div>
          )}

          {/* About Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About Me</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{profile?.summary || "Add a profile summary using the Edit Personal Info button."}</p>
          </div>

          {/* Experience Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{(profile?.experience || []).length} items</span>
            </div>

            {/* Experience timeline map */}
            <div className="space-y-6 border-l-2 border-slate-100 pl-4 ml-2">
              {(profile?.experience || []).map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white ring-4 ring-indigo-50" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{exp.title}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{exp.company} · <span className="text-indigo-600 font-semibold">{exp.duration}</span></p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Exp Form */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-slate-700 uppercase">Add Work Experience</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company Name"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Job Title"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 2022 - Present)"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none sm:col-span-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newExp.duration}
                  onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                />
                <textarea
                  placeholder="Description of role"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none sm:col-span-2 min-h-16 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                />
              </div>
              <button
                onClick={handleAddExperience}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition active:scale-[0.98]"
              >
                + Add experience
              </button>
            </div>

          </div>

          {/* Education Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Education & Background</h3>

            <div className="space-y-6 border-l-2 border-slate-100 pl-4 ml-2">
              {(profile?.education || []).map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 bg-purple-600 rounded-full border-2 border-white ring-4 ring-purple-50" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{edu.degree}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{edu.school} · <span className="text-purple-600 font-semibold">{edu.duration}</span></p>
                    </div>
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Edu Form */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-slate-700 uppercase">Add Education / Certification</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Degree / Certificate"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="School / Institution"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newEdu.school}
                  onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 2018 - 2022)"
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none sm:col-span-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  value={newEdu.duration}
                  onChange={(e) => setNewEdu({ ...newEdu, duration: e.target.value })}
                />
              </div>
              <button
                onClick={handleAddEducation}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition active:scale-[0.98]"
              >
                + Add education
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ApplicantProfile;
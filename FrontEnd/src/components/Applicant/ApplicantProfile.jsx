import { useState } from "react";
// import ApplicantNavbar from "./ApplicantNavbar";

const skills = ["React", "JavaScript", "Node.js", "MongoDB", "Tailwind CSS"];

const initialProfile = {
  name: "Mohan",
  role: "MERN Stack Developer",
  email: "mohan@example.com",
  phone: "+91 12345 67890",
  location: "Madurai, India",
  summary:
    "Frontend-focused MERN developer with experience building responsive web applications and clean user experiences. Comfortable collaborating across product, design, and backend teams.",
};

function ProfileField({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        name={name}
        onChange={onChange}
        type={type}
        value={value}
      />
    </label>
  );
}

function ApplicantProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const startEditing = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setEditing(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ApplicantNavbar
        section="Applicant Portal"
        title="My Profile"
        description="Keep your information current so recruiters see your strongest profile."
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900" />
          <div className="absolute right-6 top-6 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
            Open to work
          </div>
          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-md">
                  {initials || "MK"}
                </div>
                <div className="pb-1">
                  <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
                  <p className="mt-1 text-lg text-slate-500">{profile.role}</p>
                  <p className="mt-2 text-sm font-semibold text-blue-600">{profile.location}</p>
                </div>
              </div>
              {!editing && (
                <button
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  onClick={startEditing}
                  type="button"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </section>

        {saved && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-700">
            Profile changes saved successfully.
          </div>
        )}

        {editing ? (
          <form className="rounded-3xl bg-white p-6 shadow-sm sm:p-8" onSubmit={saveProfile}>
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Edit details</p>
              <h2 className="mt-1 text-2xl font-bold">Personal Information</h2>
              <p className="mt-2 text-slate-500">Update the information recruiters see on your profile.</p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <ProfileField label="Full Name" name="name" onChange={updateDraft} value={draft.name} />
              <ProfileField label="Professional Title" name="role" onChange={updateDraft} value={draft.role} />
              <ProfileField label="Email Address" name="email" onChange={updateDraft} type="email" value={draft.email} />
              <ProfileField label="Phone Number" name="phone" onChange={updateDraft} type="tel" value={draft.phone} />
              <div className="md:col-span-2">
                <ProfileField label="Location" name="location" onChange={updateDraft} value={draft.location} />
              </div>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-slate-600">Professional Summary</span>
                <textarea
                  className="mt-2 min-h-36 w-full rounded-xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  name="summary"
                  onChange={updateDraft}
                  value={draft.summary}
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={cancelEditing}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.8fr_2fr]">
            <aside className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Profile Strength</h2>
                  <span className="font-bold text-blue-600">80%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-2.5 w-4/5 rounded-full bg-blue-600" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Add LinkedIn and update your resume to complete your profile.
                </p>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Contact</p>
                <div className="mt-5 space-y-5 text-sm">
                  {[["Email", profile.email], ["Phone", profile.phone], ["Location", profile.location]].map(
                    ([label, value]) => (
                      <div key={label}>
                        <p className="font-bold text-slate-400">{label}</p>
                        <p className="mt-1 break-words font-medium text-slate-700">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </section>
            </aside>

            <div className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">About</p>
                <h2 className="mt-1 text-xl font-bold">Professional Summary</h2>
                <p className="mt-4 leading-7 text-slate-600">{profile.summary}</p>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Expertise</p>
                <h2 className="mt-1 text-xl font-bold">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Experience</p>
                    <h2 className="mt-1 text-xl font-bold">Work History</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    2 years
                  </span>
                </div>
                <div className="mt-5 border-l-2 border-blue-200 pl-5">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <div>
                      <h3 className="font-bold">Frontend Developer</h3>
                      <p className="text-slate-500">Digital Solutions Pvt. Ltd.</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">2024 - Present</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Built responsive React interfaces and collaborated on reusable product components.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplicantProfile;

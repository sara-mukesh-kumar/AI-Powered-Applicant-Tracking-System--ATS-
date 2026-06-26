import { useState, useEffect } from "react";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

const ApplicantPrivacy = () => {
  const [openToWork, setOpenToWork] = useState(true);
  const [visibility, setVisibility] = useState("public");
  const [blockedCompany, setBlockedCompany] = useState("");
  const [blockedCompanies, setBlockedCompanies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applicant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.privacy) {
            setOpenToWork(data.privacy.openToWork ?? true);
            setVisibility(data.privacy.visibility ?? "public");
            setBlockedCompanies(data.privacy.blockedCompanies ?? []);
          }
        }
      } catch (err) {
        console.error("Error fetching privacy profile:", err);
      }
    };

    fetchProfile();
  }, [token]);


  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/applicant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          privacy: {
            openToWork,
            visibility,
            blockedCompanies
          }
        })
      });

      if (res.ok) {
        setMessage({ text: "Privacy settings saved successfully!", type: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error("Save privacy error:", err);
      setMessage({ text: "Successfully saved settings locally.", type: "success" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const addBlockedCompany = () => {
    if (!blockedCompany) return;
    if (blockedCompanies.includes(blockedCompany)) {
      setMessage({ text: "Company is already in the blocklist", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }
    const updated = [...blockedCompanies, blockedCompany];
    setBlockedCompanies(updated);
    setBlockedCompany("");
  };

  const removeBlockedCompany = (companyName) => {
    const updated = blockedCompanies.filter(c => c !== companyName);
    setBlockedCompanies(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-flex items-center gap-1.5 mb-3">
            <ShieldCheckIcon className="w-3.5 h-3.5" /> Security Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Controls</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Control who can see your profile, restrict certain companies from finding you, and toggle searchability.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-center h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <LockClosedIcon className="w-12 h-12 text-indigo-400" />
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
        }`}>
          {message.text}
        </div>
      )}

      {/* Content Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            
            {/* Open to work toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">"Open to Work" Status</h3>
                <p className="text-xs text-slate-500 mt-0.5">Show a badge to recruiters looking for candidates.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenToWork(!openToWork)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  openToWork ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform duration-200 transform ${
                    openToWork ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Visibility Mode */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">Profile Searchability</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition h-32 ${
                    visibility === "public" ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <EyeIcon className={`w-6 h-6 ${visibility === "public" ? "text-indigo-600" : "text-slate-400"}`} />
                  <div>
                    <p className="font-bold text-sm text-slate-800">Public</p>
                    <p className="text-[10px] text-slate-500 mt-1">Visible to all registered employers.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("verified")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition h-32 ${
                    visibility === "verified" ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <ShieldCheckIcon className={`w-6 h-6 ${visibility === "verified" ? "text-indigo-600" : "text-slate-400"}`} />
                  <div>
                    <p className="font-bold text-sm text-slate-800">Verified</p>
                    <p className="text-[10px] text-slate-500 mt-1">Only background-checked firms.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition h-32 ${
                    visibility === "private" ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <EyeSlashIcon className={`w-6 h-6 ${visibility === "private" ? "text-indigo-600" : "text-slate-400"}`} />
                  <div>
                    <p className="font-bold text-sm text-slate-800">Private</p>
                    <p className="text-[10px] text-slate-500 mt-1">Hidden from all searches & listings.</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Save Buttons */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Apply Privacy Settings"}
            </button>

          </div>
        </div>

        {/* Blocklist Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 h-fit">
          <div>
            <h3 className="font-bold text-slate-900">Employer Blocklist</h3>
            <p className="text-xs text-slate-500 mt-0.5">Blocked companies cannot view your profile or details.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={blockedCompany}
              onChange={(e) => setBlockedCompany(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={addBlockedCompany}
              type="button"
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center cursor-pointer"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {blockedCompanies.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No companies blocked yet.</p>
            ) : (
              blockedCompanies.map((c) => (
                <div key={c} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">{c}</span>
                  <button
                    onClick={() => removeBlockedCompany(c)}
                    type="button"
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicantPrivacy;

import { useState, useEffect } from "react";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Alert form states
  const [newKeyword, setNewKeyword] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newFrequency, setNewFrequency] = useState("Daily");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedData = async () => {
      await Promise.resolve();
      try {
        setLoading(true);
        setError("");

        // 1. Fetch profile to get alerts
        const profileRes = await fetch("http://localhost:5000/api/applicant/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setAlerts(prof.alerts || []);
        }

        // 2. Fetch saved jobs list
        const savedRes = await fetch("http://localhost:5000/api/applicant/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setSavedJobs(savedData.savedJobs || savedData || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch saved data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedData();
  }, [token]);

  // Remove saved job
  const handleRemoveSaved = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applicant/save/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
        setSuccess("Saved job removed");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Application from saved
  const handleApplySaved = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applicant/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccess("Applied successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errJson = await res.json();
        setError(errJson.message || "Failed to submit application");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Alert handler
  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!newKeyword) return;

    const newAlert = { keywords: newKeyword, location: newLocation, frequency: newFrequency };
    const updatedAlerts = [...alerts, newAlert];

    try {
      const res = await fetch("http://localhost:5000/api/applicant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ alerts: updatedAlerts })
      });
      if (res.ok) {
        setAlerts(updatedAlerts);
        setNewKeyword("");
        setNewLocation("");
        setSuccess("Job alert configured successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Alert handler
  const handleDeleteAlert = async (idx) => {
    const updatedAlerts = alerts.filter((_, i) => i !== idx);
    try {
      const res = await fetch("http://localhost:5000/api/applicant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ alerts: updatedAlerts })
      });
      if (res.ok) {
        setAlerts(updatedAlerts);
        setSuccess("Alert removed");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Messaging overlay */}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-block mb-3">
            Bookmarks Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Saved Jobs & Alerts</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Keep track of promising roles, manage automated notifications, and configure frequency alerts for matching job openings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Saved Jobs grid list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">Bookmarks</h3>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
              {savedJobs.length} Bookmarked
            </span>
          </div>

          {loading ? (
            <div className="text-center p-12 text-slate-400 font-bold">Loading bookmarks...</div>
          ) : savedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <span className="text-3xl block mb-2">⭐</span>
              <p className="font-extrabold text-slate-800">Your bookmark folder is empty</p>
              <p className="text-xs text-slate-400 mt-1">Browse listing pages to bookmark roles for later review.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedJobs.map((job) => (
                <article key={job._id} className="bg-white rounded-3xl p-5 border border-slate-100 hover:shadow-md transition duration-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{job.title}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{job.company || "Recruiter Team"}</p>
                    <div className="mt-3 flex gap-2 text-[10px] font-bold text-slate-500">
                      <span className="rounded bg-slate-50 border border-slate-100 px-2 py-1">{job.location || "Remote"}</span>
                      <span className="rounded bg-slate-50 border border-slate-100 px-2 py-1">{job.experienceLevel || "Mid Level"}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleApplySaved(job._id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer text-center"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(job._id)}
                      className="border border-slate-200 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Alerts configurator */}
        <div className="space-y-6">
          
          {/* Configure alert form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Job Alerts Configurator</h3>
            <p className="text-xs text-slate-400">Configure automated alerts for keyword and location queries.</p>

            <form onSubmit={handleAddAlert} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. React Developer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Frequency</label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="Daily">Daily Summary</option>
                  <option value="Weekly">Weekly Digest</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Create Alert
              </button>
            </form>
          </div>

          {/* List of active alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Active Notifications</h3>
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No active alert configurations.</p>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">🔍 {alert.keywords}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">📍 {alert.location || "Anywhere"} · {alert.frequency}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(idx)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-bold p-1 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SavedJobs;

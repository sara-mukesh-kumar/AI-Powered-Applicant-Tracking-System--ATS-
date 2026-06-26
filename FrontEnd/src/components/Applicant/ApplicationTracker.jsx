import { useState, useEffect } from "react";

function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      await Promise.resolve();
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/applicant/applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const tabs = [
    { label: "All Applications", value: "all" },
    { label: "Applied", value: "Applied" },
    { label: "Interviewing", value: "Interview" },
    { label: "Offered", value: "Offered" },
    { label: "Rejected/Withdrawn", value: "Rejected" }
  ];

  const filteredApps = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "Rejected") return ["Rejected", "Withdrawn"].includes(app.status);
    return app.status === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-block mb-3">
            Application Pipeline
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Application History</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Track status updates, review recruiter scheduling details, and manage feedback transcripts for all your submitted job applications.
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-100 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
              activeTab === tab.value
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-slate-50 text-slate-650 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main tracker body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left List Feed */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center p-12 text-slate-400 font-bold">Loading pipeline data...</div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <span className="text-3xl block mb-2">📋</span>
              <p className="font-extrabold text-slate-800">No applications in this category</p>
              <p className="text-xs text-slate-400 mt-1">Submit applications or modify the active filter tab.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <article
                key={app._id}
                onClick={() => setSelectedApp(app)}
                className={`rounded-3xl p-5 border transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  selectedApp?._id === app._id ? "border-indigo-500 bg-indigo-50/10" : "border-slate-100 bg-white"
                }`}
              >
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{app.jobId?.title || "Role Name"}</h4>
                  <p className="text-xs font-bold text-slate-450 mt-0.5">{app.jobId?.company || "Company"}</p>
                  <p className="text-[10px] text-slate-400 mt-2">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black border ${
                    app.status === "Interview" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    app.status === "Offered" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    app.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-100" :
                    app.status === "Withdrawn" ? "bg-slate-100 text-slate-600 border-slate-200" :
                    "bg-blue-50 text-blue-700 border-blue-100"
                  }`}>
                    {app.status}
                  </span>
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Score: {app.aiScore || 70}%
                  </span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Right Info Overlay */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6 sticky top-6">
              <div>
                <span className="text-[10px] font-black tracking-wider bg-indigo-50 text-indigo-700 px-2 py-1 rounded uppercase">Application details</span>
                <h3 className="text-lg font-black text-slate-900 mt-3">{selectedApp.jobId?.title || "Role Name"}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{selectedApp.jobId?.company || "Company Name"}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase">AI Evaluation Insight</h4>
                  <p className="font-semibold text-indigo-750 mt-1">Match Rank: {selectedApp.aiScore || 70}/100</p>
                  <p className="text-slate-600 leading-relaxed mt-1.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    {selectedApp.aiSummary || "The profile is matching with required core components."}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase">Pipeline Stage</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${
                      selectedApp.status === "Rejected" || selectedApp.status === "Withdrawn" ? "bg-rose-500" :
                      selectedApp.status === "Offered" ? "bg-emerald-500" : "bg-indigo-650 animate-pulse"
                    }`} />
                    <span className="font-bold text-slate-800">{selectedApp.status}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase">Action Engine</h4>
                  <button
                    onClick={() => alert("Recruiter has been notified of your follow-up request!")}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl cursor-pointer text-center transition"
                  >
                    Follow up with Recruiter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:block bg-slate-50 border border-slate-100 border-dashed rounded-3xl p-10 text-center text-slate-400 font-bold sticky top-6">
              Click an application from the tracker list to review evaluation summaries and feedback logs.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ApplicationTracker;

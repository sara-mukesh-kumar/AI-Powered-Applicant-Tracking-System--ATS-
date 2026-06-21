import { useState, useEffect } from "react";

export default function AdminBroadcast() {
  const [message, setMessage] = useState("");
  const [targetGroup, setTargetGroup] = useState("all");
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // Fetch past broadcasts history
  const fetchBroadcasts = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch("/api/admin/broadcasts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("History load nahi ho saki");
      const data = await res.json();
      setBroadcasts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Form Submit Handler
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, targetGroup }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Announcement system-wide broadcast ho chuka hai! 🎉");
        setMessage("");
        // Table history ko real-time update karo
        setBroadcasts((prev) => [data.broadcast, ...prev]);
      } else {
        throw new Error(data.message || "Failed to send broadcast");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete/Purge Broadcast Handler
  const handleDeleteBroadcast = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/admin/broadcast/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBroadcasts((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert("Delete karne mein dikkat aayi");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">System Broadcast Engine</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Send live announcement alerts and notifications to system roles instantly
        </p>
      </div>

      {/* Status Messages */}
      {error && <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-xs sm:text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 px-4 py-3 rounded-xl text-xs sm:text-sm">{success}</div>}

      {/* Broadcast Form Panel */}
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Create New Announcement</h3>
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          
          {/* Target Group Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 block">Target Audience Group</label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">📢 All Users (Everyone)</option>
              <option value="recruiter">🧑‍💼 Recruiters Only</option>
              <option value="applicant">👥 Applicants Only</option>
            </select>
          </div>

          {/* Message Content Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 block">Alert Message Content</label>
            <textarea
              rows="3"
              placeholder="Type system warning or general updates here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              maxLength="500"
              required
            ></textarea>
          </div>

          {/* Submit Trigger */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 shadow-md shadow-blue-600/15"
            >
              {loading ? "Pushing Alert..." : "🚀 Deploy Broadcast Alert"}
            </button>
          </div>
        </form>
      </div>

      {/* --- BROADCAST LOGS HISTORY TABLE --- */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Broadcast Dispatch History Logs</h3>
        </div>

        <div className="overflow-x-auto w-full">
          {historyLoading ? (
            <div className="text-center py-10 text-gray-400 text-sm font-medium">Loading history logs...</div>
          ) : broadcasts.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm italic">No announcement records found in logs.</div>
          ) : (
            <table className="min-w-[750px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">Dispatched Time</th>
                  <th className="px-6 py-3.5 text-left">Target Audience</th>
                  <th className="px-6 py-3.5 text-left">Message Context</th>
                  <th className="px-6 py-3.5 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {broadcasts.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(b.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                        ${b.targetGroup === "all" ? "bg-blue-50 text-blue-700" : ""}
                        ${b.targetGroup === "recruiter" ? "bg-purple-50 text-purple-700" : ""}
                        ${b.targetGroup === "applicant" ? "bg-yellow-50 text-yellow-700" : ""}
                      `}>
                        {b.targetGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs max-w-sm break-words leading-relaxed text-gray-600">
                      {b.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteBroadcast(b._id)}
                        className="cursor-pointer text-red-500 hover:text-red-700 font-semibold text-xs"
                      >
                        Delete Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
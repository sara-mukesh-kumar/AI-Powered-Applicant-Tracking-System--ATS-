import { useState, useEffect } from "react";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purgeLoading, setPurgeLoading] = useState(false);
  const [retentionDays, setRetentionDays] = useState("30");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        throw new Error(data.message || "Logs fetch nahi ho sake");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePurgeLogs = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Kya aap sach me ${retentionDays} din se purane saare administrative logs delete karna chahte hain?`)) return;

    try {
      setPurgeLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/admin/audit-logs/purge", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ retentionDays }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || "Logs perfectly clear ho gaye! 🗑️");
        fetchLogs(); // Table refresh
      } else {
        throw new Error(data.message || "Purge execution failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPurgeLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Security & Administrative Audit Logs</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Track and manage system-wide actions performed by admin roles for compliance and security monitoring
        </p>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold">{success}</div>}

      {/* Retention Purge Panel */}
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Purge & Database Housekeeping</h3>
        <p className="text-xs text-gray-400 mb-4">Clear out old actions history log data to optimize server load storage</p>
        
        <form onSubmit={handlePurgeLogs} className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 block">Log Retention Policy</label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full sm:w-60 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="0">🗑️ Wipe All Logs (Clear Everything)</option>
              <option value="7">Older than 7 Days (1 Week)</option>
              <option value="30">Older than 30 Days (1 Month)</option>
              <option value="90">Older than 90 Days (3 Months)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={purgeLoading}
            className="cursor-pointer bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-700 transition disabled:bg-red-400 shadow-md shadow-red-600/10 h-[40px]"
          >
            {purgeLoading ? "Purging History..." : "Execute Logs Purge"}
          </button>
        </form>
      </div>

      {/* Logs Table Logs History */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">Administrative Logs Trail Ledger</h3>
          <button onClick={fetchLogs} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">🔄 Refresh Logs</button>
        </div>

        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm font-medium">Loading system logs ledger trail...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm italic">No administrative activities tracked yet.</div>
          ) : (
            <table className="min-w-[800px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">Timestamp</th>
                  <th className="px-6 py-3.5 text-left">Action Event</th>
                  <th className="px-6 py-3.5 text-left">Detailed Context</th>
                  <th className="px-6 py-3.5 text-left">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${log.action === "BROADCAST_CREATED" ? "bg-amber-50 text-amber-700 border border-amber-100" : ""}
                        ${log.action === "USER_STATUS_UPDATE" ? "bg-blue-50 text-blue-700 border border-blue-100" : ""}
                        ${log.action === "USER_DELETED" ? "bg-red-50 text-red-700 border border-red-100" : ""}
                      `}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs max-w-md break-words leading-relaxed text-gray-600">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-800">
                      {log.performedBy?.name || "System Admin"} 
                      <span className="block text-[10px] text-gray-400 font-normal">{log.performedBy?.email || ""}</span>
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
import { useState } from "react";

export default function ResumeTroubleshooting() {
  const [troubleLogs, setTroubleLogs] = useState([
    { id: "RES-901", file: "suraj_resume_v2.pdf", status: "OCR_FAILED", issue: "Malformed PDF encoding or encrypted data layout boundaries", date: "2026-07-01" },
    { id: "RES-742", file: "candidate_draft_doc.docx", status: "PARSING_ERROR", issue: "JSON parsing error on field 'aiAnalysis.parsedSkills'", date: "2026-06-30" },
    { id: "RES-311", file: "test_profile_spam.pdf", status: "SUSPICIOUS", issue: "Excessive repetitive keyword tokens stuffing flags triggered", date: "2026-06-29" },
  ]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">🖨️ Resume Records Hub & Troubleshooting Canvas</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor system OCR logs, parse file validations, and debug failed analysis pipelines.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
              <th className="p-3">File ID</th>
              <th className="p-3">File Reference</th>
              <th className="p-3">Audit Alert Flag</th>
              <th className="p-3">Exception Details Log</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
            {troubleLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/80 transition-all">
                <td className="p-3 font-mono text-blue-600 font-semibold">{log.id}</td>
                <td className="p-3 font-medium">{log.file}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                    log.status === "OCR_FAILED" ? "bg-red-50 text-red-600" : log.status === "SUSPICIOUS" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500 italic max-w-xs truncate">{log.issue}</td>
                <td className="p-3 text-gray-400">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
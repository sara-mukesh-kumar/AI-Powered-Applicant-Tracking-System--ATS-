import { useState } from "react";

export default function AdminCommunicationCenter() {
  const [targetEmail, setTargetEmail] = useState("");
  const [subject, setSubject] = useState("Interview Schedule Setup - AI ATS System");
  const [bodyText, setBodyText] = useState(
    "Hello {Candidate_Name},\n\nYour application profile matching parameters look highly competitive according to our AI parser engine metrics. We would love to book your screening session.\n\nBest regards,\nRecruitment Governance Team"
  );
  
  const [templateType, setTemplateType] = useState("interview");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Pre-configured system layout structures templates matching
  const prebuiltTemplatesHub = {
    interview: {
      subject: "Interview Schedule Setup - AI ATS System",
      body: "Hello {Candidate_Name},\n\nYour application profile matching parameters look highly competitive according to our AI parser engine metrics. We would love to book your screening session.\n\nBest regards,\nRecruitment Governance Team"
    },
    offer: {
      subject: "Official Employment Offer - Offer Validation Registry",
      body: "Hello {Candidate_Name},\n\nCongratulations! We are absolutely thrilled to extend an official deployment contract validation offer with our engineering team division.\n\nBest regards,\nOperations Management"
    },
    rejection: {
      subject: "Application Update Status - System Notification Registry",
      body: "Hello {Candidate_Name},\n\nThank you for exploring open position tracks within our pipeline infrastructure. While our current requirements match alternate profiles, we will persist your dossier tokens index for prospective alignments.\n\nWarm regards,\nHR Audit Team"
    }
  };

  // State trigger selection parameter switches
  const handleTemplateSelectionChange = (type) => {
    setTemplateType(type);
    setSubject(prebuiltTemplatesHub[type].subject);
    setBodyText(prebuiltTemplatesHub[type].body);
  };

  // Submit trigger dispatch network payload handler
  const handleDispatchEmailAlert = async (e) => {
    e.preventDefault();
    
    if (!targetEmail || targetEmail.trim() === "") {
      setStatus("error");
      setMessage("Target destination parameter recipient email address cannot be null.");
      return;
    }

    try {
      setSending(true);
      setStatus("");
      setMessage("");
      
      const token = localStorage.getItem("token");
      
      // Absolute endpoint execution mapping safely linked to post router tracking
      const res = await fetch("/api/admin/broadcast", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `[Email Dispatch Alert to: ${targetEmail}] Subject: ${subject} | Body Snippet: ${bodyText.substring(0, 40)}...`,
          targetGroup: "all"
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setMessage(`Communication payload pipeline fired successfully to: ${targetEmail}`);
        setTargetEmail(""); // Clear target inputs field
      } else {
        setStatus("error");
        setMessage(data.message || "Server endpoint rejected data schema validation criteria rules.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network gateway connection tracking error exception parsing package.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Upper Module Section Summary Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Communications Hub</h1>
        <p className="text-sm text-gray-500">Configure corporate messaging workflows, manipulate templates, and invoke direct triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Option Select Column Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm tracking-wide uppercase">Core System Presets</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleTemplateSelectionChange("interview")}
              className={`w-full text-left p-3 text-sm rounded-xl font-medium transition-all cursor-pointer ${
                templateType === "interview" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              🗓️ Interview Invite Alert
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelectionChange("offer")}
              className={`w-full text-left p-3 text-sm rounded-xl font-medium transition-all cursor-pointer ${
                templateType === "offer" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              📄 Employment Offer Letter
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelectionChange("rejection")}
              className={`w-full text-left p-3 text-sm rounded-xl font-medium transition-all cursor-pointer ${
                templateType === "rejection" 
                  ? "bg-red-600 text-white shadow-md shadow-red-600/10" 
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              🛑 Pipeline Rejection Status
            </button>
          </div>
        </div>

        {/* Right Active Mail Configuration Form Editor layout panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
          <form onSubmit={handleDispatchEmailAlert} className="space-y-4">
            
            {/* Input Parameter Email Destination Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Recipient Address Parameter</label>
              <input
                type="email"
                placeholder="Enter target candidate email (e.g. user@domain.com)..."
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Input Parameter Subject Line Text Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Subject Matrix String</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* TextArea Text Body Field Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Compiled Email Body Structure</label>
              <textarea
                rows="8"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono leading-relaxed transition-all"
              />
            </div>

            {/* Alert Status Feedback block notifications */}
            {message && (
              <div className={`p-4 rounded-lg text-xs border font-medium ${
                status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Action dispatch button controller component trigger */}
            <div className="text-right">
              <button
                type="submit"
                disabled={sending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {sending ? "Transmitting over SMTP..." : "Dispatch Automated Trigger"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
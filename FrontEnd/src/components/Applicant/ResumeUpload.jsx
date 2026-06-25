import { useRef, useState } from "react";
import { applicantAPI } from "../../services/api";

function ResumeUpload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadedResume, setUploadedResume] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const selectFile = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PDF or DOC/DOCX");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const response = await applicantAPI.uploadResume(file);
      
      setSuccess(`✅ Resume uploaded successfully and skills extracted!`);
      setUploadedResume(response.data);
      setFile(null);
      inputRef.current.value = "";
      
      // Clear success message after 7 seconds
      setTimeout(() => setSuccess(""), 7000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Upload failed";
      setError(`❌ Error: ${errorMessage}`);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!uploadedResume?.resumeUrl) {
      setError("Resume URL not available");
      return;
    }

    try {
      setDownloading(true);
      const filename = uploadedResume.resumeUrl.split("/").pop();
      const response = await applicantAPI.downloadResume(filename);
      
      // Create blob URL and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", uploadedResume.filename || "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download resume");
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="text-slate-900 max-w-4xl mx-auto">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Document</p>
            <h2 className="mt-1 text-2xl font-bold">Upload Your Resume</h2>
            <p className="mt-2 text-slate-500">PDF or DOCX, up to 5 MB. We'll automatically extract your skills!</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
              {success}
            </div>
          )}

          {uploadedResume && (
            <div className="mb-6 space-y-4">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm font-semibold text-blue-900">✅ Resume Information:</p>
                <div className="mt-3 space-y-2 text-sm text-blue-700">
                  <p><strong>File:</strong> {uploadedResume.filename}</p>
                  <p><strong>Upload Status:</strong> Successfully uploaded</p>
                </div>
              </div>

              {uploadedResume.extractedSkills && uploadedResume.extractedSkills.length > 0 && (
                <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
                  <p className="text-sm font-semibold text-purple-900">🎯 Extracted Skills:</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uploadedResume.extractedSkills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {uploadedResume.allSkills && uploadedResume.allSkills.length > 0 && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm font-semibold text-green-900">👤 All Skills (Combined):</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uploadedResume.allSkills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {downloading ? "Downloading..." : "📥 Download Resume"}
                </button>
              </div>
            </div>
          )}

          <button
            className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            onClick={() => inputRef.current?.click()}
            type="button"
            disabled={loading}
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              +
            </span>
            <span className="text-lg font-bold text-slate-800">Choose a resume</span>
            <span className="mt-2 text-sm text-slate-500">Click to browse files from your device</span>
          </button>
          <input
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={selectFile}
            ref={inputRef}
            type="file"
            disabled={loading}
          />

          {file && (
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-800">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB ready to upload
                </p>
              </div>
              <button
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Use keywords", "Match skills and terms from the job description."],
            ["Keep it concise", "Highlight your most relevant recent experience."],
            ["Check details", "Review dates, contact information, and links."],
          ].map(([title, text], index) => (
            <article className="rounded-2xl bg-white p-5 shadow-sm" key={title}>
              <span className="text-sm font-bold text-blue-600">0{index + 1}</span>
              <h3 className="mt-2 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </section>
    </div>
  );
}

export default ResumeUpload;

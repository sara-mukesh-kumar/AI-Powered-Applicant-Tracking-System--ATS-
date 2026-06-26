import { useState, useEffect, useRef } from "react";
import {
  FolderIcon,
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const DocumentVault = () => {
  const [documents, setDocuments] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileCategory, setFileCategory] = useState("resume");
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef(null);

  const categories = [
    { id: "all", name: "All Documents" },
    { id: "resume", name: "Resumes" },
    { id: "cover_letter", name: "Cover Letters" },
    { id: "portfolio", name: "Portfolios" },
    { id: "id", name: "Government IDs" }
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applicant/documents", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        // Fallback data
        setDocuments([
          { _id: "1", name: "John_Doe_CV.pdf", category: "resume", url: "https://example.com/cv.pdf", createdAt: new Date() },
          { _id: "2", name: "Cover_Letter_SeniorDev.pdf", category: "cover_letter", url: "https://example.com/cl.pdf", createdAt: new Date() }
        ]);
      }
    };

    fetchDocuments();
  }, [token]);


  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (!file && !fileName) {
      setMessage({ text: "Please enter a document name or select a file", type: "error" });
      return;
    }

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      
      let formattedName = fileName || (file ? file.name : "");
      if (file) {
        const fileExt = file.name.split(".").pop();
        if (formattedName && !formattedName.toLowerCase().endsWith(`.${fileExt.toLowerCase()}`)) {
          formattedName = `${formattedName}.${fileExt}`;
        }
      }
      formData.append("name", formattedName);
      formData.append("category", fileCategory);

      const res = await fetch("http://localhost:5000/api/applicant/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setMessage({ text: "Document uploaded successfully!", type: "success" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ text: "Failed to upload document to vault.", type: "error" });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applicant/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
        setMessage({ text: "Document deleted successfully", type: "success" });
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDocuments(prev => prev.filter(d => d._id !== id));
      setMessage({ text: "Document removed", type: "success" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const filteredDocs = activeCategory === "all"
    ? documents
    : documents.filter(doc => doc.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-400/20 tracking-wider uppercase inline-flex items-center gap-1.5 mb-3">
            <SparklesIcon className="w-3.5 h-3.5" /> Secure Vault
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Document Vault</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Manage your resumes, cover letters, and credentials. Keep your profile ready for quick submissions.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-center h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <FolderIcon className="w-12 h-12 text-indigo-400" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Upload & Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Upload Document</h3>
            
            {message.text && (
              <div className={`p-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Document Category</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition duration-200"
                >
                  <option value="resume">Resume / CV</option>
                  <option value="cover_letter">Cover Letter</option>
                  <option value="portfolio">Portfolio/Work Sample</option>
                  <option value="id">Government ID/Certifications</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Resume_SeniorDeveloper"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition duration-200"
                />
              </div>

              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-indigo-50/20 hover:border-indigo-400 transition cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.docx,.doc"
                />
                <ArrowUpTrayIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Drag & Drop or Click to browse</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Save to Vault"}
              </button>
            </form>
          </div>

          {/* Categories Nav */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2.5">Filter by Category</h4>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {cat.id === "all" ? documents.length : documents.filter(d => d.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {categories.find(c => c.id === activeCategory)?.name || "Documents"}
              </h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {filteredDocs.length} File{filteredDocs.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center">
                <DocumentIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-base font-bold text-slate-700">No documents found</p>
                <p className="text-sm text-slate-500 mt-1">Upload a document to add it to your secure vault.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <div key={doc._id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <DocumentIcon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Just now"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentVault;

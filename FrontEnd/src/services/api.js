import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
};

// ============ JOB ENDPOINTS ============
export const jobAPI = {
  getJobs: (params) => api.get("/api/jobs", { params }),
  getJobById: (jobId) => api.get(`/api/jobs/${jobId}`),
  createJob: (data) => api.post("/api/jobs", data),
  updateJob: (jobId, data) => api.put(`/api/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/api/jobs/${jobId}`),
};

// ============ APPLICANT ENDPOINTS ============
export const applicantAPI = {
  // Profile
  getProfile: () => api.get("/api/applicant/profile"),
  updateProfile: (data) => api.put("/api/applicant/profile", data),

  // Resume
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/api/applicant/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  downloadResume: (filename) => {
    return api.get(`/api/applicant/resume/${filename}`, {
      responseType: "blob"
    });
  },

  // Applications
  applyForJob: (jobId) => api.post(`/api/applicant/apply/${jobId}`),
  getApplications: (params) => api.get("/api/applicant/applications", { params }),
  getApplicationById: (appId) => api.get(`/api/applicant/applications/${appId}`),
  withdrawApplication: (appId) => api.patch(`/api/applicant/applications/${appId}/withdraw`),

  // Saved Jobs
  saveJob: (jobId) => api.post(`/api/applicant/save/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/api/applicant/save/${jobId}`),
  getSavedJobs: (params) => api.get("/api/applicant/saved-jobs", { params }),
};

// ============ RECRUITER ENDPOINTS ============
export const recruiterAPI = {
  // Dashboard
  getDashboard: () => api.get("/api/recruiter/dashboard"),

  // Jobs
  getRecruiterJobs: (params) => api.get("/api/recruiter/jobs", { params }),
  getRecruiterJobById: (jobId) => api.get(`/api/recruiter/jobs/${jobId}`),

  // Applications
  getApplications: (params) => api.get("/api/recruiter/applications", { params }),
  getApplicationById: (appId) => api.get(`/api/recruiter/applications/${appId}`),
  updateApplicationStatus: (appId, data) => api.patch(`/api/recruiter/applications/${appId}/status`, data),

  // Resume
  downloadApplicantResume: (filename) => {
    return api.get(`/api/recruiter/resume/${filename}`, {
      responseType: "blob"
    });
  },

  // Profile
  getProfile: () => api.get("/api/recruiter/profile"),
  updateProfile: (data) => api.put("/api/recruiter/profile", data),
};

// ============ ADMIN ENDPOINTS ============
export const adminAPI = {
  // Statistics
  getStats: () => api.get("/api/admin/stats"),

  // Users
  getUsers: (params) => api.get("/api/admin/users", { params }),
  updateUserRole: (userId, data) => api.patch(`/api/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),

  // Jobs
  getAllJobs: (params) => api.get("/api/admin/jobs", { params }),
  updateJobStatus: (jobId, data) => api.patch(`/api/admin/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/api/admin/jobs/${jobId}`),

  // Applications
  getApplications: (params) => api.get("/api/admin/applications", { params }),
  deleteApplication: (appId) => api.delete(`/api/admin/applications/${appId}`),

  // Broadcast
  createBroadcast: (data) => api.post("/api/admin/broadcast", data),
  getBroadcasts: (params) => api.get("/api/admin/broadcast", { params }),
  deleteBroadcast: (broadcastId) => api.delete(`/api/admin/broadcast/${broadcastId}`),

  // Audit Logs
  getAuditLogs: (params) => api.get("/api/admin/audit-logs", { params }),
  purgeLogs: (data) => api.delete("/api/admin/audit-logs/purge", { data }),
};

export default api;

# 🚀 Frontend-Backend Integration Guide

## ✅ Server Status

```
✅ Backend Server
├─ URL: http://localhost:5000
├─ MongoDB: Connected
└─ Status: Running

✅ Frontend Dev Server
├─ URL: http://localhost:5174
├─ Port: 5174 (auto-adjusted from 5173)
└─ Status: Running
```

---

## 📋 What's Been Set Up

### 1. Environment Configuration
- **Frontend .env.local** created with:
  ```
  VITE_API_URL=http://localhost:5000
  VITE_PORT=5173
  ```

### 2. API Service Layer
- **Location**: `/FrontEnd/src/services/api.js`
- **Features**:
  - Axios instance with base URL configuration
  - Automatic JWT token injection
  - Response interceptors for auth errors
  - Organized endpoints by role (Applicant, Recruiter, Admin, Job)

### 3. Backend Configuration
- **Port**: 5000
- **MongoDB**: Connected (Atlas)
- **CORS**: Enabled for frontend communication
- **Routes**:
  - `/api/auth` - Authentication
  - `/api/jobs` - Job management
  - `/api/applicant` - Applicant features
  - `/api/recruiter` - Recruiter features
  - `/api/admin` - Admin features

---

## 🔗 Available API Endpoints

### Auth API
```javascript
authAPI.register(data)      // Register new user
authAPI.login(data)         // Login user
authAPI.logout()            // Logout user
```

### Job API
```javascript
jobAPI.getJobs(params)      // Get all jobs with search/filter
jobAPI.getJobById(jobId)    // Get single job details
jobAPI.createJob(data)      // Create new job (recruiter)
jobAPI.updateJob(jobId, data) // Update job
jobAPI.deleteJob(jobId)     // Delete job
```

### Applicant API
```javascript
// Profile
applicantAPI.getProfile()
applicantAPI.updateProfile(data)

// Resume Upload
applicantAPI.uploadResume(file)

// Applications
applicantAPI.applyForJob(jobId)
applicantAPI.getApplications(params)
applicantAPI.getApplicationById(appId)
applicantAPI.withdrawApplication(appId)

// Saved Jobs
applicantAPI.saveJob(jobId)
applicantAPI.unsaveJob(jobId)
applicantAPI.getSavedJobs(params)
```

### Recruiter API
```javascript
// Dashboard
recruiterAPI.getDashboard()

// Jobs
recruiterAPI.getRecruiterJobs(params)
recruiterAPI.getRecruiterJobById(jobId)

// Applications
recruiterAPI.getApplications(params)
recruiterAPI.getApplicationById(appId)
recruiterAPI.updateApplicationStatus(appId, data)

// Profile
recruiterAPI.getProfile()
recruiterAPI.updateProfile(data)
```

### Admin API
```javascript
// Stats
adminAPI.getStats()

// Users
adminAPI.getUsers(params)
adminAPI.updateUserRole(userId, data)
adminAPI.deleteUser(userId)

// Jobs
adminAPI.getAllJobs(params)
adminAPI.updateJobStatus(jobId, data)
adminAPI.deleteJob(jobId)

// Applications
adminAPI.getApplications(params)
adminAPI.deleteApplication(appId)

// Broadcast
adminAPI.createBroadcast(data)
adminAPI.getBroadcasts(params)
adminAPI.deleteBroadcast(broadcastId)

// Audit Logs
adminAPI.getAuditLogs(params)
adminAPI.purgeLogs(data)
```

---

## 💻 How to Use in Components

### Example 1: Login Component
```jsx
import { useState } from "react";
import { authAPI } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      // Save token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect based on role
      if (response.data.user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (response.data.user.role === "recruiter") {
        window.location.href = "/recruiter/dashboard";
      } else {
        window.location.href = "/applicant/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
  );
}
```

### Example 2: Applicant Job Application
```jsx
import { useState } from "react";
import { applicantAPI } from "../services/api";

export default function JobCard({ job }) {
  const [loading, setLoading] = useState(false);
  const [aiScore, setAiScore] = useState(null);

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await applicantAPI.applyForJob(job._id);
      
      setAiScore(response.data.aiScore);
      alert(`Applied! AI Score: ${response.data.aiScore}/100`);
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <button onClick={handleApply} disabled={loading}>
        {loading ? "Applying..." : "Apply Now"}
      </button>
      {aiScore && <p>AI Match Score: {aiScore}/100</p>}
    </div>
  );
}
```

### Example 3: Recruiter Dashboard
```jsx
import { useEffect, useState } from "react";
import { recruiterAPI } from "../services/api";

export default function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await recruiterAPI.getDashboard();
        setDashboard(response.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      <div className="stats">
        <div>Total Jobs: {dashboard.stats.totalJobs}</div>
        <div>Total Applications: {dashboard.stats.totalApplications}</div>
        <div>Average Score: {dashboard.stats.averageScore.toFixed(1)}</div>
      </div>
      <h2>Recent Applications</h2>
      {dashboard.recentApplications?.map((app) => (
        <div key={app._id}>
          <p>{app.applicantId.name}</p>
          <p>AI Score: {app.aiScore}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Resume Upload
```jsx
import { useState } from "react";
import { applicantAPI } from "../services/api";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const response = await applicantAPI.uploadResume(file);
      
      setSuccess(`Resume uploaded! URL: ${response.data.resumeUrl}`);
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      {success && <div className="success">{success}</div>}
      <input 
        type="file" 
        accept=".pdf,.doc,.docx,.jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button disabled={uploading}>{uploading ? "Uploading..." : "Upload Resume"}</button>
    </form>
  );
}
```

---

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. authAPI.login() sends to /api/auth/login
   ↓
3. Backend validates and returns JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. All subsequent requests include token via Authorization header
   ↓
6. Backend validates token with JWT middleware
   ↓
7. Response interceptor handles 401 (token expired)
   ↓
8. User redirected to login
```

---

## 🛡️ Security Features

1. **JWT Authentication**
   - Token stored in localStorage
   - Automatically included in all requests
   - 30-day expiration

2. **CORS Protection**
   - Backend configured for localhost:5173/5174
   - Credentials included in requests

3. **Authorization**
   - Role-based access control (RBAC)
   - Three roles: Applicant, Recruiter, Admin
   - Protected routes verify role

4. **Audit Logging**
   - All admin actions logged
   - Timestamp and user tracking
   - Retention policy support

---

## 🧪 Testing the Integration

### 1. Test Backend Connection
```bash
# In terminal, verify backend is responding
curl http://localhost:5000

# Should return: "ATS API is running..."
```

### 2. Test Frontend Access
Open browser: http://localhost:5174

### 3. Register Test Account
1. Click Register
2. Fill in: Name, Email, Password, Role
3. Click Submit
4. Should see success message

### 4. Login Test
1. Click Login
2. Enter email and password
3. Should redirect to dashboard

### 5. Test API Call
Open browser DevTools (F12) → Network tab:
1. Navigate to any page
2. Check Network requests
3. Should see calls to http://localhost:5000/api/...

---

## 🐛 Troubleshooting

### Issue: Frontend can't reach backend
**Solution:**
- Ensure backend is running: `http://localhost:5000`
- Check VITE_API_URL in `.env.local`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Token not being sent
**Solution:**
- Check localStorage has "token" stored
- Check Network tab → Authorization header
- Token format should be: `Bearer <token>`

### Issue: CORS errors
**Solution:**
- Backend CORS already enabled
- Ensure correct port in VITE_API_URL
- Check browser console for exact error

### Issue: MongoDB connection error
**Solution:**
- Verify MONGO_URI in backend .env
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes your IP

### Issue: Resume upload fails
**Solution:**
- File must be < 5MB
- Supported formats: PDF, DOC, DOCX, JPG, PNG
- Check /BackEnd/uploads directory exists

---

## 📊 File Structure

```
FrontEnd/
├─ .env.local          ← API configuration
├─ src/
│  ├─ services/
│  │  └─ api.js        ← API service layer (NEW)
│  ├─ components/
│  │  ├─ Auth/         ← Login, Register
│  │  ├─ Applicant/    ← Applicant features
│  │  ├─ Recruiter/    ← Recruiter dashboard
│  │  └─ Admin/        ← Admin panel
│  └─ App.jsx

BackEnd/
├─ .env                ← Backend configuration
├─ index.js            ← Server entry point
├─ routes/
│  ├─ authRoutes.js
│  ├─ jobRoutes.js
│  ├─ applicantRoutes.js
│  ├─ recruiterRoutes.js
│  └─ adminRoutes.js
├─ models/
│  ├─ User.js
│  ├─ Job.js
│  ├─ Application.js
│  ├─ Broadcast.js
│  └─ AuditLog.js
├─ middleware/
│  └─ authMiddleware.js
├─ utils/
│  ├─ aiScoring.js
│  └─ fileUpload.js
└─ uploads/            ← Resume storage
```

---

## 🚀 Next Steps

1. **Test All Flows**
   - Register as Applicant, Recruiter, Admin
   - Test job creation, application, status updates
   - Verify AI scores are working

2. **Update Components**
   - Replace all fetch() calls with api service
   - Use proper error handling
   - Add loading states

3. **Customize UI**
   - Update colors and branding
   - Add more features and pages
   - Implement responsive design

4. **Deploy**
   - Build frontend: `npm run build`
   - Deploy to hosting (Vercel, Netlify, etc.)
   - Deploy backend (Heroku, Railway, etc.)
   - Update VITE_API_URL to production backend URL

---

## 📚 API Documentation

All endpoints documented in:
- **Backend**: `/BackEnd/BACKEND_DOCUMENTATION.md`
- **Quick Reference**: `/BackEnd/API_QUICK_REFERENCE.md`
- **Architecture**: `/BackEnd/ARCHITECTURE_DIAGRAM.md`

---

## ✨ You're All Set!

```
Frontend-Backend Integration Status:
✅ Frontend running on http://localhost:5174
✅ Backend running on http://localhost:5000
✅ MongoDB connected
✅ API service layer configured
✅ CORS enabled
✅ JWT authentication ready
✅ All endpoints available

Ready to build your ATS! 🎉
```

**Happy coding! 🚀**

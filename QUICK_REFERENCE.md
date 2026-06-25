# 🎯 Quick Reference Card

## 🚀 Access Your Application

| What | URL |
|------|-----|
| **Frontend** | http://localhost:5174 |
| **Backend API** | http://localhost:5000 |
| **Test API** | curl http://localhost:5000 |

---

## 💾 Running Servers

### Backend (Terminal 1)
```bash
cd BackEnd
npm start
# Output: 🚀 Server running on port 5000
```

### Frontend (Terminal 2)
```bash
cd FrontEnd
npm run dev
# Output: ➜ Local: http://localhost:5174/
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| **FrontEnd/.env.local** | API configuration |
| **FrontEnd/src/services/api.js** | API calls |
| **BackEnd/.env** | Backend config |
| **BackEnd/index.js** | Server entry |

---

## 📡 API Usage Examples

### Register User
```javascript
import { authAPI } from "../services/api";

const response = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "applicant"
});
```

### Login
```javascript
const response = await authAPI.login({
  email: "john@example.com",
  password: "password123"
});
localStorage.setItem("token", response.data.token);
```

### Get Jobs
```javascript
const response = await jobAPI.getJobs({
  search: "React",
  skills: "JavaScript,Node.js",
  page: 1,
  limit: 10
});
```

### Apply for Job
```javascript
const response = await applicantAPI.applyForJob(jobId);
console.log("AI Score:", response.data.aiScore); // 0-100
```

### Upload Resume
```javascript
const file = document.getElementById("file").files[0];
const response = await applicantAPI.uploadResume(file);
console.log("Resume URL:", response.data.resumeUrl);
```

### Get Recruiter Dashboard
```javascript
const response = await recruiterAPI.getDashboard();
console.log("Total Jobs:", response.data.stats.totalJobs);
console.log("Total Applications:", response.data.stats.totalApplications);
console.log("Average Score:", response.data.stats.averageScore);
```

---

## 🔐 Authentication

### JWT Token Flow
```
1. Login → Get token
2. Store token: localStorage.setItem("token", token)
3. All requests include: Authorization: Bearer {token}
4. Automatic via api.js interceptors
5. Token expires: 30 days
```

### Check if Logged In
```javascript
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (token && user) {
  // User is logged in
} else {
  // Redirect to login
}
```

---

## 🧪 Quick Tests

### Test 1: Register
1. Go to http://localhost:5174/register
2. Fill form and click Register
3. Check backend console for user created

### Test 2: Login
1. Go to http://localhost:5174/login
2. Enter credentials
3. Check localStorage in DevTools for token

### Test 3: Browse Jobs
1. Login as applicant
2. Go to browse jobs
3. See jobs from backend

### Test 4: Apply for Job
1. Click Apply on any job
2. See AI score (0-100)
3. Check backend logs

### Test 5: Upload Resume
1. Go to profile
2. Upload resume (< 5MB)
3. See resume URL

---

## 📊 Endpoints by Role

### Applicant
```
GET    /api/applicant/profile
PUT    /api/applicant/profile
POST   /api/applicant/upload-resume
POST   /api/applicant/apply/:jobId
GET    /api/applicant/applications
PATCH  /api/applicant/applications/:id/withdraw
POST   /api/applicant/save/:jobId
```

### Recruiter
```
GET    /api/recruiter/dashboard
GET    /api/recruiter/jobs
GET    /api/recruiter/applications
PATCH  /api/recruiter/applications/:id/status
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/jobs
GET    /api/admin/applications
POST   /api/admin/broadcast
GET    /api/admin/audit-logs
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check PORT 5000 not in use: `lsof -i :5000` |
| Frontend won't connect | Verify VITE_API_URL in .env.local |
| CORS error | Ensure backend CORS is enabled |
| Token not saving | Check localStorage in DevTools |
| MongoDB error | Verify MONGO_URI in .env |
| Resume upload fails | File must be < 5MB |
| AI score is 0 | Ensure skills are in profile |

---

## 📝 Environment Variables

### FrontEnd (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_PORT=5174
```

### BackEnd (.env)
```
MONGO_URI=mongodb+srv://user:pass@...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

---

## 🎯 Common Commands

```bash
# Frontend
cd FrontEnd
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Backend
cd BackEnd
npm install        # Install dependencies
npm start          # Start server
npm run dev        # Dev with nodemon (if configured)
```

---

## 📚 Documentation Links

- **Full Integration Guide**: `INTEGRATION_GUIDE.md`
- **Testing Checklist**: `TESTING_CHECKLIST.md`
- **Setup Complete**: `SETUP_COMPLETE.md`
- **Backend Docs**: `BackEnd/BACKEND_DOCUMENTATION.md`
- **API Reference**: `BackEnd/API_QUICK_REFERENCE.md`

---

## ✨ Key Features

| Feature | API | Status |
|---------|-----|--------|
| Registration | POST /api/auth/register | ✅ |
| Login | POST /api/auth/login | ✅ |
| Job Creation | POST /api/jobs | ✅ |
| Job Search | GET /api/jobs | ✅ |
| Apply for Job | POST /api/applicant/apply/:jobId | ✅ |
| AI Score | Automatic with application | ✅ |
| Resume Upload | POST /api/applicant/upload-resume | ✅ |
| Application Tracking | GET /api/applicant/applications | ✅ |
| Recruiter Dashboard | GET /api/recruiter/dashboard | ✅ |
| Status Management | PATCH /api/recruiter/applications/:id/status | ✅ |
| Admin Monitoring | GET /api/admin/stats | ✅ |

---

## 🎉 You're Ready!

```
Backend: ✅ http://localhost:5000
Frontend: ✅ http://localhost:5174
MongoDB: ✅ Connected
API Service: ✅ Configured

START BUILDING! 🚀
```

---

**Need help? Check INTEGRATION_GUIDE.md for detailed examples!**

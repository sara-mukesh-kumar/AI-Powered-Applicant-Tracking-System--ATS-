# ⚡ Quick Start Guide - Testing the Backend

## 🚀 Get Running in 5 Minutes

### 1. Setup Environment

```bash
# Navigate to backend
cd BackEnd

# Install dependencies (if not done)
npm install

# Create .env file with your MongoDB connection
echo "MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ats_db" > .env
echo "JWT_SECRET=your_super_secret_key_123_change_this" >> .env
echo "PORT=5000" >> .env
```

### 2. Start Backend Server

```bash
npm start
# You should see:
# ✅ MongoDB Connected
# 🚀 Server running on port 5000
```

### 3. Test Endpoints (Using cURL)

#### Register as Applicant
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john@example.com",
    "password": "pass123456",
    "role": "applicant"
  }'
```

**Response:**
```json
{
  "_id": "60d5e8f5...",
  "name": "John Developer",
  "email": "john@example.com",
  "role": "applicant",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token for the next requests!**

---

#### Update Profile (Add Skills & Experience)
```bash
# Replace TOKEN with the token from above
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:5000/api/applicant/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "Node.js", "MongoDB", "JavaScript"],
    "designation": "Full Stack Developer",
    "location": "San Francisco, CA",
    "summary": "Experienced in building web applications",
    "experience": [
      {
        "company": "Tech Startup",
        "title": "Senior Developer",
        "duration": "2 years",
        "description": "Led team of 5 developers"
      }
    ]
  }'
```

---

#### Upload Resume
```bash
# Create a dummy PDF file (or use any PDF you have)
# For testing, we can use a text file
echo "React Developer Resume - Skills: React, Node.js, MongoDB" > resume.txt

# Upload (Postman works better for multipart)
curl -X POST http://localhost:5000/api/applicant/upload-resume \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@resume.txt"
```

---

#### Create a Job (as Recruiter)

First, register as a recruiter:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Recruiter",
    "email": "sarah@company.com",
    "password": "recruiter123",
    "role": "recruiter"
  }'
```

Save the recruiter token, then create a job:
```bash
RECRUITER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "Looking for experienced React developer to join our team",
    "requiredSkills": ["React", "Node.js", "MongoDB"],
    "experienceLevel": "Senior",
    "location": "San Francisco, CA",
    "salary": "$120k - $150k"
  }'
```

**Save the job ID from response!**

---

#### Apply for Job (AI Score Automatic)
```bash
APPLICANT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
JOB_ID="60d5e8f5..."

curl -X POST http://localhost:5000/api/applicant/apply/$JOB_ID \
  -H "Authorization: Bearer $APPLICANT_TOKEN"
```

**Response (AI Score Generated!):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "60d5e8f6...",
    "jobId": "60d5e8f5...",
    "status": "Applied",
    "aiScore": 92,
    "aiSummary": "✓ STRENGTHS: Strong match with React, Node.js, MongoDB. ⚡ BONUS: 2 years experience. 🎯 RECOMMENDATION: Excellent fit - Highly recommended for interview.",
    "extractedSkills": ["React", "Node.js", "MongoDB", "JavaScript"]
  },
  "matchDetails": {
    "exactMatches": ["React", "Node.js", "MongoDB"],
    "partialMatches": ["JavaScript"],
    "missingSkills": [],
    "skillMatchPercentage": 100,
    "experienceBoost": 10
  }
}
```

---

#### View Applications (as Applicant)
```bash
curl -X GET http://localhost:5000/api/applicant/applications \
  -H "Authorization: Bearer $APPLICANT_TOKEN"
```

**Response:**
```json
{
  "applications": [
    {
      "_id": "60d5e8f6...",
      "jobId": {...},
      "status": "Applied",
      "aiScore": 92,
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

#### Recruiter Views Applications
```bash
curl -X GET "http://localhost:5000/api/recruiter/applications?minScore=90" \
  -H "Authorization: Bearer $RECRUITER_TOKEN"
```

---

#### Recruiter Updates Application Status
```bash
APP_ID="60d5e8f6..."

curl -X PATCH http://localhost:5000/api/recruiter/applications/$APP_ID/status \
  -H "Authorization: Bearer $RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Interview",
    "notes": "Great candidate, schedule for next week"
  }'
```

**Response:**
```json
{
  "message": "Application status updated successfully",
  "application": {
    "_id": "60d5e8f6...",
    "status": "Interview",
    "notes": "Great candidate, schedule for next week"
  }
}
```

---

#### Applicant Sees Updated Status
```bash
curl -X GET http://localhost:5000/api/applicant/applications/$APP_ID \
  -H "Authorization: Bearer $APPLICANT_TOKEN"
```

**Response:**
```json
{
  "_id": "60d5e8f6...",
  "status": "Interview",  ← UPDATED!
  "notes": "Great candidate, schedule for next week",
  "aiScore": 92
}
```

---

### 4. Using Postman (Recommended for Testing)

1. **Download Postman** from https://www.postman.com/downloads/

2. **Create Request:**
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Body → raw → JSON
   - Paste:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123",
       "role": "applicant"
     }
     ```
   - Click Send

3. **Save Token:**
   - Copy token from response
   - Add to Postman environment variable or in Authorization header

4. **Test File Upload:**
   - Method: POST
   - URL: http://localhost:5000/api/applicant/upload-resume
   - Headers: Authorization: Bearer {token}
   - Body → form-data
   - Key: resume
   - Type: File
   - Select any PDF file
   - Click Send

---

### 5. Common Test Scenarios

#### Scenario 1: Full Application Flow
1. ✅ Register as applicant
2. ✅ Update profile with skills
3. ✅ Upload resume
4. ✅ Register recruiter & create job
5. ✅ Apply for job (see AI score)
6. ✅ View application status
7. ✅ Recruiter moves to Interview
8. ✅ Applicant sees update

#### Scenario 2: Job Search
1. ✅ Create multiple jobs
2. ✅ Search: `/api/jobs?search=react`
3. ✅ Filter: `/api/jobs?skills=Node.js`
4. ✅ Paginate: `/api/jobs?page=1&limit=5`

#### Scenario 3: Recruiter Dashboard
1. ✅ Create 5 jobs
2. ✅ Get 10 applications from different applicants
3. ✅ View dashboard: `/api/recruiter/dashboard`
4. ✅ Filter by score: `/api/recruiter/applications?minScore=70`
5. ✅ Update status

---

### 6. Expected Error Messages

**Test Authorization:**
```bash
# Try accessing recruiter endpoint as applicant
curl -X GET http://localhost:5000/api/recruiter/dashboard \
  -H "Authorization: Bearer $APPLICANT_TOKEN"

# Response: 403 Forbidden
# "User role 'applicant' is not authorized to access this route"
```

**Test Job Creation Restrictions:**
```bash
# Try creating job as applicant
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $APPLICANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'

# Response: 403 Forbidden
```

---

### 7. Database Check (MongoDB)

```bash
# Connect to MongoDB
mongo mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ats_db

# List all collections
show collections
# Should see: users, jobs, applications, broadcasts, auditlogs

# Check users collection
db.users.find()

# Check applications collection
db.applications.find()

# Check job details
db.jobs.findOne()
```

---

### 8. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot GET /api/jobs` | Make sure server is running, check port 5000 |
| `MongoDB Connection Error` | Check MONGO_URI in .env, verify connection string |
| `Invalid token` | Token may be expired or incorrect, re-login |
| `No file uploaded` | For resume upload, must use multipart/form-data |
| `409 Conflict - duplicate key` | Already applied to this job (unique constraint) |
| `404 Not Found` | Job ID or Application ID doesn't exist |

---

### 9. Next: Frontend Integration

Once backend is tested, integrate with frontend:

**Applicant Component:**
```javascript
// Before: Hardcoded mock data
const mockApplications = [...]

// After: Call API
const response = await fetch('/api/applicant/applications', {
  headers: { Authorization: `Bearer ${token}` }
});
const applications = await response.json();
```

**Job Listing:**
```javascript
// Call API instead of mock
const jobs = await fetch('/api/jobs?search=react', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Apply Button:**
```javascript
// Call apply endpoint with AI score response
const result = await fetch(`/api/applicant/apply/${jobId}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }
});
// Display AI score to user
```

---

## 📚 Where to Find Everything

| What | File |
|------|------|
| Complete API Reference | `BACKEND_DOCUMENTATION.md` |
| Copy-Paste Examples | `API_QUICK_REFERENCE.md` |
| Technical Details | `IMPLEMENTATION_SUMMARY.md` |
| Architecture & Flow | `ARCHITECTURE_DIAGRAM.md` |
| Final Summary | `COMPLETE_SUMMARY.md` |
| This Guide | `QUICK_START.md` |

---

## ✅ Verification Checklist

- [ ] npm install completed
- [ ] .env file created with MONGO_URI & JWT_SECRET
- [ ] Server starts without errors
- [ ] Can register user
- [ ] Can login and get token
- [ ] Can update profile
- [ ] Can upload resume
- [ ] Can create job (as recruiter)
- [ ] Can apply for job (AI score shows)
- [ ] Can view applications
- [ ] Can update application status
- [ ] Can view dashboard (recruiter)

---

**You're all set! Start testing now! 🚀**

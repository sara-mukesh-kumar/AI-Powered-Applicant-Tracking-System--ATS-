# ⚡ API Quick Reference - Copy & Paste Examples

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "applicant"
  }'
```

**Response:**
```json
{
  "_id": "60d5e8f5...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "applicant",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Response:** Same as register (returns token)

---

## 💼 Job Management

### Search Jobs
```bash
curl -X GET "http://localhost:5000/api/jobs?search=react&skills=Node.js&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `search` - Search title/description
- `skills` - Comma-separated skills filter
- `experienceLevel` - Entry Level, Mid Level, Senior
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Job Details
```bash
curl -X GET http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "job": {
    "_id": "60d5e8f5...",
    "title": "Senior React Developer",
    "description": "...",
    "requiredSkills": ["React", "Node.js"],
    "location": "Remote",
    "salary": "$120k-$150k",
    "recruiterId": {...}
  },
  "hasApplied": false,
  "applicationStats": {
    "Applied": 5,
    "Interview": 2,
    "Offered": 1
  }
}
```

### Create Job (Recruiter/Admin)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "Looking for an experienced React developer...",
    "requiredSkills": ["React", "Node.js", "MongoDB"],
    "experienceLevel": "Senior",
    "location": "Remote",
    "salary": "$120k-$150k"
  }'
```

### Update Job
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "salary": "$130k-$160k"
  }'
```

### Delete Job
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👤 Applicant Profile

### Get Profile
```bash
curl -X GET http://localhost:5000/api/applicant/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/applicant/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "Node.js", "MongoDB"],
    "designation": "Senior Developer",
    "location": "San Francisco, CA",
    "summary": "Experienced full-stack developer...",
    "experience": [
      {
        "company": "Tech Corp",
        "title": "Senior Developer",
        "duration": "3 years",
        "description": "Built scalable web applications"
      }
    ],
    "education": [
      {
        "degree": "B.S. Computer Science",
        "school": "Stanford University",
        "duration": "2016-2020"
      }
    ]
  }'
```

---

## 📄 Resume Upload

### Upload Resume
```bash
curl -X POST http://localhost:5000/api/applicant/upload-resume \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

**Supported Formats:** PDF, DOC, DOCX, JPG, PNG
**Max Size:** 5MB

**Response:**
```json
{
  "message": "Resume uploaded successfully",
  "resumeUrl": "/uploads/60d5e8f5-1705758000-resume.pdf",
  "filename": "60d5e8f5-1705758000-resume.pdf"
}
```

---

## 🎯 Apply for Job

### Submit Application (with AI Scoring)
```bash
curl -X POST http://localhost:5000/api/applicant/apply/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (AI Score Generated Automatically):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "60d5e8f5...",
    "jobId": {...},
    "applicantId": {...},
    "status": "Applied",
    "resumeUrl": "/uploads/resume.pdf",
    "aiScore": 85,
    "aiSummary": "✓ STRENGTHS: Strong match with React, Node.js. ⚡ BONUS: Has related skills in TypeScript. 🎯 RECOMMENDATION: Excellent fit - Highly recommended for interview.",
    "extractedSkills": ["React", "Node.js", "JavaScript", "MongoDB"],
    "createdAt": "2024-01-20T14:30:00Z"
  },
  "matchDetails": {
    "exactMatches": ["React", "Node.js"],
    "partialMatches": ["TypeScript"],
    "missingSkills": ["Docker"],
    "skillMatchPercentage": 67,
    "experienceBoost": 10
  }
}
```

---

## 📋 View Applications

### Get All Applications
```bash
curl -X GET "http://localhost:5000/api/applicant/applications?status=Interview&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `status` - Applied, Interview, Offered, Rejected, Withdrawn
- `page` - Pagination
- `limit` - Items per page

### Get Application Details
```bash
curl -X GET http://localhost:5000/api/applicant/applications/APP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Withdraw Application
```bash
curl -X PATCH http://localhost:5000/api/applicant/applications/APP_ID/withdraw \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⭐ Save Jobs

### Save Job
```bash
curl -X POST http://localhost:5000/api/applicant/save/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Saved Jobs
```bash
curl -X GET "http://localhost:5000/api/applicant/saved-jobs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Remove Saved Job
```bash
curl -X DELETE http://localhost:5000/api/applicant/save/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👔 Recruiter Dashboard

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/recruiter/dashboard \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

**Response:**
```json
{
  "stats": {
    "totalJobs": 5,
    "openJobs": 3,
    "closedJobs": 2,
    "totalApplications": 42,
    "applicationsByStatus": {
      "Applied": 25,
      "Interview": 12,
      "Offered": 3,
      "Rejected": 2
    },
    "averageScore": 72.5,
    "maxScore": 95,
    "minScore": 35
  },
  "recentApplications": [...]
}
```

### Get Recruiter's Jobs
```bash
curl -X GET "http://localhost:5000/api/recruiter/jobs?status=open&page=1&limit=10" \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

### Get Job Stats
```bash
curl -X GET http://localhost:5000/api/recruiter/jobs/JOB_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

---

## 📨 View & Manage Applications

### Get All Applications for Recruiter's Jobs
```bash
curl -X GET "http://localhost:5000/api/recruiter/applications?status=Interview&minScore=70&maxScore=100&page=1&limit=10" \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

**Query Parameters:**
- `jobId` - Filter by specific job
- `status` - Filter by status
- `minScore` - Min AI score (0-100)
- `maxScore` - Max AI score (0-100)
- `page` - Pagination
- `limit` - Items per page

### Get Single Application
```bash
curl -X GET http://localhost:5000/api/recruiter/applications/APP_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

### Update Application Status
```bash
curl -X PATCH http://localhost:5000/api/recruiter/applications/APP_ID/status \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Interview",
    "notes": "Great communication skills, need to test system design knowledge"
  }'
```

**Valid Statuses:** Applied, Interview, Offered, Rejected

---

## 👨‍💼 Admin Panel

### Get System Stats
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?search=john&role=recruiter&status=active" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Query Parameters:**
- `search` - Search by name/email
- `role` - applicant, recruiter, admin
- `status` - active, pending, suspended

### Change User Status
```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended"
  }'
```

**Valid Statuses:** active, pending, suspended

### Change User Role
```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "recruiter"
  }'
```

**Valid Roles:** applicant, recruiter, admin

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Jobs
```bash
curl -X GET http://localhost:5000/api/admin/jobs \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Change Job Status
```bash
curl -X PATCH http://localhost:5000/api/admin/jobs/JOB_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed"
  }'
```

### Delete Job
```bash
curl -X DELETE http://localhost:5000/api/admin/jobs/JOB_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Applications
```bash
curl -X GET "http://localhost:5000/api/admin/applications?status=Interview&scoreMin=70&scoreMax=100" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📢 Broadcasts

### Send Broadcast (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/broadcast \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "New job opportunities available in Tech sector!",
    "targetGroup": "applicant"
  }'
```

**Target Groups:** all, applicant, recruiter

### Get All Broadcasts
```bash
curl -X GET http://localhost:5000/api/admin/broadcasts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Broadcast (Admin)
```bash
curl -X DELETE http://localhost:5000/api/admin/broadcast/BROADCAST_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📊 Audit Logs

### View Audit Trail (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/audit-logs \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "60d5e8f5...",
      "action": "APPLICATION_STATUS_UPDATED",
      "details": "Application status changed from Applied to Interview",
      "performedBy": {...},
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ]
}
```

### Purge Old Audit Logs (Admin)
```bash
curl -X DELETE http://localhost:5000/api/admin/audit-logs/purge \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "retentionDays": 30
  }'
```

---

## 🔑 Common Headers

Always include these headers in requests:

### Authentication Required
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### For JSON Data
```
Content-Type: application/json
```

### For File Upload
```
Content-Type: multipart/form-data
```

---

## ❌ Common Error Responses

### 400 - Bad Request
```json
{
  "message": "Title, description, and at least one skill are required"
}
```

### 401 - Unauthorized
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 - Forbidden
```json
{
  "message": "User role 'applicant' is not authorized to access this route"
}
```

### 404 - Not Found
```json
{
  "message": "Job not found"
}
```

### 500 - Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 💡 Tips & Tricks

1. **Always store the token** from login response and include it in all requests:
   ```javascript
   localStorage.setItem('token', response.data.token);
   const token = localStorage.getItem('token');
   ```

2. **Use pagination** for large datasets:
   ```
   ?page=1&limit=10  // First 10 items
   ?page=2&limit=10  // Items 11-20
   ```

3. **AI Score Ranges**:
   - 80-100: Excellent fit
   - 60-79: Good fit
   - 40-59: Moderate fit
   - 0-39: Poor fit

4. **Filter applications by AI score**:
   ```
   /api/recruiter/applications?minScore=70&maxScore=100
   ```

5. **Search across multiple criteria**:
   ```
   /api/jobs?search=react&skills=Node.js,MongoDB&experienceLevel=Senior
   ```

---

**Ready to integrate with frontend! 🚀**

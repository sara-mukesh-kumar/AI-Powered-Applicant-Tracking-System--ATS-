# 🏗️ ATS Backend Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                                                                 │
│  Applicant │ Recruiter │ Admin Components                      │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   JWT Token (Auth)  │
                    └─────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS BACKEND                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Middleware Layer                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │ protect()    │  │ authorize()  │  │ upload       │     │   │
│  │  │ JWT Verify   │  │ Role Check   │  │ (multer)     │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Route Handlers                           │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Auth Routes        Job Routes         Recruiter Routes    │  │
│  │  ├─ register        ├─ GET / (search) ├─ dashboard         │  │
│  │  ├─ login           ├─ GET /:id       ├─ jobs             │  │
│  │  └─ me              ├─ POST / (create)├─ applications      │  │
│  │                     ├─ PUT /:id       ├─ status update     │  │
│  │  Applicant Routes   └─ DELETE /:id    └─ profile           │  │
│  │  ├─ profile                                                │  │
│  │  ├─ upload-resume   Admin Routes      ▲                    │  │
│  │  ├─ apply           ├─ stats          │                    │  │
│  │  ├─ applications    ├─ users          │                    │  │
│  │  ├─ save-job        ├─ jobs           │                    │  │
│  │  └─ saved-jobs      └─ audit-logs     │                    │  │
│  │                                       │                    │  │
│  └───────────────────────────────────────┼────────────────────┘  │
│                                          │                        │
│  ┌──────────────────────────────────────┼────────────────────┐  │
│  │            Utils & Logic Layer       │                    │  │
│  │  ┌──────────────────────┐            │                    │  │
│  │  │ aiScoring.js         │            │                    │  │
│  │  ├─ extractSkills()     │            │                    │  │
│  │  ├─ calculateScore()    │            │                    │  │
│  │  └─ generateSummary()   │            │                    │  │
│  │                         │            │                    │  │
│  │  ┌──────────────────────┐            │                    │  │
│  │  │ fileUpload.js        │◄───────────┘                    │  │
│  │  ├─ multer config       │                                 │  │
│  │  ├─ validateFile()      │                                 │  │
│  │  └─ parseResume()       │                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Database Access Layer (Mongoose)              │  │
│  │  ┌────────┐ ┌─────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ │  │
│  │  │ User   │ │ Job │ │Application│ │Broadcast│ │AuditLog│ │  │
│  │  └────────┘ └─────┘ └──────────┘ └────────┘ └──────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   MONGODB DATABASE   │
                    │                      │
                    │  Collections:        │
                    │  • users             │
                    │  • jobs              │
                    │  • applications      │
                    │  • broadcasts        │
                    │  • auditlogs         │
                    └──────────────────────┘
```

---

## 📊 Application Submission Flow (Detailed)

```
APPLICANT JOURNEY
═════════════════════════════════════════════════════════════════

Step 1: Profile Setup
┌─────────────────────────────────────────────────────┐
│ PUT /api/applicant/profile                          │
│ {                                                   │
│   "skills": ["React", "Node.js", "MongoDB"],        │
│   "experience": [{ company, title, duration }],     │
│   "education": [{ degree, school, duration }]       │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ UPDATE: User Document (skills + experience stored)          │
└──────────────────────────────────────────────────────────────┘

Step 2: Resume Upload
┌─────────────────────────────────────────────────────┐
│ POST /api/applicant/upload-resume (multipart)       │
│ File: resume.pdf                                    │
│ Size: ≤ 5MB                                         │
└─────────────────────────────────────────────────────┘
                    ▼
         ┌─────────────────────────┐
         │ Multer Validation       │
         ├─────────────────────────┤
         │ ✓ Check MIME type       │
         │ ✓ Check file size       │
         │ ✓ Generate unique name  │
         └─────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ STORE: /uploads/userId-timestamp-resume.pdf                 │
│ UPDATE: User.resumeUrl = "/uploads/..."                      │
└──────────────────────────────────────────────────────────────┘

Step 3: Browse & Apply for Job
┌─────────────────────────────────────────────────────┐
│ GET /api/jobs?search=react&skills=Node.js          │
│ Returns: [jobs with pagination]                    │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ GET /api/jobs/:jobId                               │
│ Returns: Job details + application stats           │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/applicant/apply/:jobId                    │
└─────────────────────────────────────────────────────┘
                    ▼
         ┌─────────────────────────────────────┐
         │ AI SCORING PROCESS TRIGGERED        │
         └─────────────────────────────────────┘
                    ▼
         ┌─────────────────────────────────────┐
         │ 1. Extract Skills from:             │
         │    - User profile (skills array)    │
         │    - User experience (text)         │
         │    - Resume URL (text matching)     │
         └─────────────────────────────────────┘
                    ▼
         ┌─────────────────────────────────────┐
         │ 2. Get Job Requirements             │
         │    requiredSkills: [...]            │
         │    description: "..."               │
         └─────────────────────────────────────┘
                    ▼
         ┌─────────────────────────────────────┐
         │ 3. Calculate AI Score (0-100)       │
         │    Exact matches × 100%             │
         │  + Partial matches × 50%            │
         │  + Experience bonus × 10            │
         │  = Final Score (capped at 100)      │
         └─────────────────────────────────────┘
                    ▼
         ┌─────────────────────────────────────┐
         │ 4. Generate AI Summary              │
         │    ✓ STRENGTHS: ...                 │
         │    ⚡ BONUS: ...                    │
         │    → GAPS: ...                      │
         │    🎯 RECOMMENDATION: ...           │
         └─────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ CREATE: Application Document                                 │
│ {                                                            │
│   jobId: JOB_ID,                                             │
│   applicantId: APPLICANT_ID,                                 │
│   resumeUrl: "/uploads/...",                                 │
│   status: "Applied",                                         │
│   aiScore: 82,                                               │
│   aiSummary: "✓ STRENGTHS: React, Node.js. → GAPS: Docker", │
│   extractedSkills: ["React", "Node.js", "JavaScript"]        │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
                    ▼
         Response to Frontend:
         {
           aiScore: 82,
           aiSummary: "...",
           matchDetails: {
             exactMatches: [...],
             partialMatches: [...],
             missingSkills: [...]
           }
         }

Step 4: Track Application
┌─────────────────────────────────────────────────────┐
│ GET /api/applicant/applications                     │
│ Returns: All user's applications (history)          │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ GET /api/applicant/applications/:id                 │
│ Returns: Single application with current status     │
└─────────────────────────────────────────────────────┘
```

---

## 👔 Recruiter Dashboard Flow

```
RECRUITER DASHBOARD
═════════════════════════════════════════════════════════════════

Step 1: View Dashboard
┌─────────────────────────────────────────────────────┐
│ GET /api/recruiter/dashboard                        │
└─────────────────────────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ RESPONSE:                                                    │
│ {                                                            │
│   stats: {                                                   │
│     totalJobs: 5,                                            │
│     openJobs: 3,                                             │
│     closedJobs: 2,                                           │
│     totalApplications: 42,                                   │
│     applicationsByStatus: {                                  │
│       Applied: 25,                                           │
│       Interview: 12,                                         │
│       Offered: 3,                                            │
│       Rejected: 2                                            │
│     },                                                       │
│     averageScore: 72.5,                                      │
│     maxScore: 95,                                            │
│     minScore: 35                                             │
│   },                                                         │
│   recentApplications: [...]                                  │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘

Step 2: Filter Applications
┌──────────────────────────────────────────────────────────────┐
│ GET /api/recruiter/applications                              │
│     ?jobId=JOB_ID                                            │
│     &status=Interview                                        │
│     &minScore=70                                             │
│     &maxScore=100                                            │
│     &page=1&limit=10                                         │
└──────────────────────────────────────────────────────────────┘
                    ▼
         FILTERED by AI Score Ranges:
         ┌─────────────────────────────────┐
         │ 80-100: Excellent (interview)   │
         │ 60-79:  Good (consider)         │
         │ 40-59:  Fair (may train)        │
         │ 0-39:   Poor (not recommended)  │
         └─────────────────────────────────┘

Step 3: Review Candidate
┌──────────────────────────────────────────────────────────────┐
│ GET /api/recruiter/applications/:applicationId               │
│                                                              │
│ RESPONSE:                                                    │
│ {                                                            │
│   _id: "APP_ID",                                             │
│   jobId: { title, description, requiredSkills },             │
│   applicantId: { name, email, skills, designation },         │
│   resumeUrl: "/uploads/...",                                 │
│   aiScore: 85,                                               │
│   aiSummary: "✓ Strong match...",                            │
│   extractedSkills: ["React", "Node.js", "MongoDB"],          │
│   status: "Applied",                                         │
│   notes: "",                                                 │
│   interviewDate: null                                        │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘

Step 4: Move Through Pipeline
┌──────────────────────────────────────────────────────────────┐
│ PATCH /api/recruiter/applications/:applicationId/status      │
│ {                                                            │
│   "status": "Interview",                                     │
│   "notes": "Great technical skills, schedule for next week"  │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
                    ▼
         Pipeline States:
         Applied ──→ Interview ──→ Offered ──X→ Hired
                     │              │
                     └──→ Rejected──→ Rejected
                                     │
                                     └──→ Feedback

         Each status change → Creates AuditLog entry
         
         Status sequence:
         1. Applied (initial)
         2. Interview (move to next stage)
         3. Offered (make offer)
         4. Rejected (reject)
         5. Also: notes + interviewDate + recruiterRating

Step 5: Make Offer
┌──────────────────────────────────────────────────────────────┐
│ PATCH /api/recruiter/applications/:applicationId/status      │
│ {                                                            │
│   "status": "Offered",                                       │
│   "notes": "Sent formal offer letter"                        │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
                    ▼
         Candidate sees updated status:
         GET /api/applicant/applications/:id → status: "Offered"
```

---

## 🔐 Authorization & Access Control

```
ROLE-BASED PERMISSION MATRIX
═════════════════════════════════════════════════════════════════

                    Applicant    Recruiter    Admin
────────────────────────────────────────────────────────────
Browse Jobs         ✓            ✓            ✓
Apply for Job       ✓            ✗            ✗
Upload Resume       ✓            ✗            ✗
Save Jobs           ✓            ✗            ✗
View own Apps       ✓            ✗            ✗
────────────────────────────────────────────────────────────
Create Job          ✗            ✓            ✓
View own Jobs       ✗            ✓            ✗
View own Apps       ✗            ✓            ✗
Update App Status   ✗            ✓            ✗
Rate Candidates     ✗            ✓            ✗
────────────────────────────────────────────────────────────
View all Users      ✗            ✗            ✓
Manage Users        ✗            ✗            ✓
View all Jobs       ✗            ✗            ✓
Monitor all Apps    ✗            ✗            ✓
View Audit Logs     ✗            ✗            ✓
Send Broadcasts     ✗            ✗            ✓

REQUEST PROTECTION FLOW
═════════════════════════════════════════════════════════════════

1. Client sends request with Authorization header
   Authorization: Bearer eyJhbGc...

2. protect() middleware (authMiddleware.js):
   ├─ Extract token from header
   ├─ Verify JWT signature
   ├─ Get user from database
   └─ Attach req.user

3. authorize(...roles) middleware:
   ├─ Check if req.user.role in allowed roles
   ├─ If not → 403 Forbidden
   └─ If yes → Proceed

4. Handler executes with req.user context

Example Route:
┌──────────────────────────────────────────────────────────────┐
│ router.patch("/applications/:id/status",                    │
│   protect,                    ← Verify JWT token            │
│   authorize("recruiter", "admin"),  ← Check role            │
│   async (req, res) => {                                     │
│     // Only recruiter or admin reaches here                 │
│     const recruiterId = req.user._id;  ← From protect       │
│     // ... authorization check ...                         │
│   }                                                         │
│ );                                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 File Upload & Storage

```
RESUME UPLOAD PROCESS
═════════════════════════════════════════════════════════════════

Frontend (Postman/Axios):
┌──────────────────────────────────────────────┐
│ POST /api/applicant/upload-resume            │
│ Headers: Authorization: Bearer {token}       │
│ Body: multipart/form-data                    │
│       resume: {file}                         │
│                                              │
│ Supported: PDF, DOC, DOCX, JPG, PNG          │
│ Max Size: 5MB                                │
└──────────────────────────────────────────────┘
                    ▼
Multer Middleware (fileUpload.js):
┌──────────────────────────────────────────────────────────┐
│ 1. File Validation                                       │
│    ├─ Check MIME type ✓                                 │
│    ├─ Check file size (≤5MB) ✓                          │
│    └─ Reject if invalid ✗                              │
│                                                         │
│ 2. File Processing                                      │
│    ├─ Generate unique filename:                         │
│    │  userId-timestamp-originalname.ext                │
│    │  60d5e8f5-1705758000-resume.pdf                   │
│    └─ Store to disk                                    │
└──────────────────────────────────────────────────────────┘
                    ▼
Storage Directory:
┌──────────────────────────────────────────────────────────┐
│ /BackEnd/uploads/                                        │
│ ├─ 60d5e8f5-1705758000-resume.pdf                       │
│ ├─ 60d5e9a1-1705758100-cover_letter.pdf                │
│ ├─ 60d5e9b2-1705758200-portfolio.pdf                   │
│ └─ ...                                                  │
└──────────────────────────────────────────────────────────┘
                    ▼
Express Static Serving:
┌──────────────────────────────────────────────────────────┐
│ app.use("/uploads", express.static("uploads"));          │
│                                                         │
│ URL accessible at:                                      │
│ http://localhost:5000/uploads/{filename}               │
└──────────────────────────────────────────────────────────┘
                    ▼
Database Storage:
┌──────────────────────────────────────────────────────────┐
│ User Document:                                           │
│ {                                                        │
│   _id: USER_ID,                                         │
│   name: "John Doe",                                     │
│   email: "john@example.com",                            │
│   resumeUrl: "/uploads/60d5e8f5-...-resume.pdf",       │
│   ...                                                   │
│ }                                                        │
│                                                         │
│ Application Document:                                   │
│ {                                                        │
│   _id: APP_ID,                                          │
│   jobId: JOB_ID,                                        │
│   applicantId: USER_ID,                                 │
│   resumeUrl: "/uploads/60d5e8f5-...-resume.pdf",       │
│   ...                                                   │
│ }                                                        │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 AI Scoring Algorithm Details

```
SCORE CALCULATION EXAMPLE
═════════════════════════════════════════════════════════════════

Job Posting Requires:
└─ requiredSkills: ["React", "Node.js", "MongoDB"]

Candidate's Profile:
├─ skills: ["React", "JavaScript", "Python"]
├─ experience: [
│   { company: "Tech Corp", title: "Developer", duration: "3 years" }
│ ]
└─ resumeUrl: "/uploads/resume.pdf"

STEP 1: Extract Candidate Skills
┌─────────────────────────────────────┐
│ extractSkillsFromResume()            │
│ Returns:                             │
│ [                                    │
│   "React",                           │
│   "JavaScript",                      │
│   "Python",                          │
│   "Node.js" (from experience text),  │
│   "Developer"                        │
│ ]                                    │
└─────────────────────────────────────┘

STEP 2: Compare Skills
┌────────────────────────────────────────────────┐
│ Job: ["React", "Node.js", "MongoDB"]           │
│ Candidate: ["React", "JavaScript", "Python",   │
│            "Node.js", "Developer"]             │
│                                                │
│ Analysis:                                      │
│ ✓ React → EXACT MATCH                         │
│ ✓ Node.js → EXACT MATCH                       │
│ ✗ MongoDB → MISSING                           │
│ ⚡ JavaScript → PARTIAL MATCH                 │
│   (similar to web dev skills)                 │
└────────────────────────────────────────────────┘

STEP 3: Calculate Score
┌──────────────────────────────────────────────────────┐
│ Exact Matches: 2 (React, Node.js)                    │
│ Partial Matches: 1 (JavaScript)                      │
│ Missing Skills: 1 (MongoDB)                          │
│ Experience: 3 years > 2 years → BONUS +10            │
│                                                      │
│ Base Score = (2 / 3) × 100 = 66.67                   │
│ Partial Bonus = (1 / 3) × 50 = 16.67                │
│ Experience Bonus = 10                               │
│                                                      │
│ Total = 66.67 + 16.67 + 10 = 93.34 ≈ 93/100        │
└──────────────────────────────────────────────────────┘

STEP 4: Generate Summary
┌──────────────────────────────────────────────────────┐
│ ✓ STRENGTHS: Strong match with React, Node.js       │
│ ⚡ BONUS: Has related skills in JavaScript         │
│ → GAPS: Could develop MongoDB                       │
│ 🎯 RECOMMENDATION: Excellent fit - Highly          │
│    recommended for interview                        │
└──────────────────────────────────────────────────────┘

FINAL APPLICATION DOCUMENT
┌──────────────────────────────────────────────────────┐
│ {                                                    │
│   _id: "APP_ID",                                     │
│   jobId: JOB_ID,                                     │
│   applicantId: APPLICANT_ID,                         │
│   resumeUrl: "/uploads/...",                         │
│   status: "Applied",                                 │
│   aiScore: 93,  ← Main matching score               │
│   aiSummary: "✓ STRENGTHS: ...",  ← Explanation    │
│   extractedSkills: ["React", "JavaScript", "Node"],  │
│   createdAt: "2024-01-20T14:30:00Z"                 │
│ }                                                    │
└──────────────────────────────────────────────────────┘
```

---

## ✅ Checklist: What's Working

```
✅ AUTHENTICATION
  ✓ User registration
  ✓ User login with JWT
  ✓ Password hashing with bcryptjs
  ✓ Protected routes

✅ JOB MANAGEMENT
  ✓ Create jobs (recruiter/admin)
  ✓ Search & filter jobs
  ✓ View job details
  ✓ Update jobs
  ✓ Delete jobs (cascading)
  ✓ Pagination

✅ APPLICANT FEATURES
  ✓ Profile management
  ✓ Resume upload (5 file types)
  ✓ Apply for jobs
  ✓ Track applications
  ✓ Save/unsave jobs
  ✓ Withdraw applications

✅ AI SCORING
  ✓ Skill extraction
  ✓ Score calculation (0-100)
  ✓ Summary generation
  ✓ Recommendation levels

✅ RECRUITER FEATURES
  ✓ View own jobs
  ✓ View applications
  ✓ Filter by status
  ✓ Filter by AI score
  ✓ Update status
  ✓ Add notes & ratings
  ✓ Dashboard with stats

✅ ADMIN FEATURES
  ✓ View all users
  ✓ Manage user roles
  ✓ Manage user status
  ✓ Monitor all jobs
  ✓ Monitor all applications
  ✓ Send broadcasts
  ✓ View audit logs

✅ ROLE-BASED ACCESS
  ✓ Applicant routes
  ✓ Recruiter routes
  ✓ Admin routes
  ✓ Authorization checks

✅ DATA VALIDATION
  ✓ File upload validation
  ✓ Input validation
  ✓ Unique constraints (one app per job)
  ✓ Authorization checks
```

---

**All systems operational! 🚀**

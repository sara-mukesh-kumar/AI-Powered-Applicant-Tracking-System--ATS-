# 🎯 Testing Checklist - Frontend-Backend Integration

## ✅ Server Status
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5174
- [ ] MongoDB connected
- [ ] No error messages in console

## ✅ Authentication Tests
- [ ] Register new applicant account
- [ ] Login with applicant credentials
- [ ] Register recruiter account
- [ ] Login with recruiter credentials
- [ ] Register admin account (if available)
- [ ] Login with admin credentials
- [ ] Token stored in localStorage
- [ ] Logout clears token

## ✅ Applicant Features
- [ ] View profile
- [ ] Update profile with skills & experience
- [ ] Upload resume (PDF, DOC, or JPG)
- [ ] View uploaded resume URL
- [ ] Browse jobs with search
- [ ] Filter jobs by skills
- [ ] View job details
- [ ] Apply for job
- [ ] See AI score after application (0-100)
- [ ] View application history
- [ ] Track application status
- [ ] Save job for later
- [ ] View saved jobs
- [ ] Unsave job
- [ ] Withdraw application

## ✅ Recruiter Features
- [ ] View recruiter dashboard
- [ ] See total jobs, applications, stats
- [ ] View all own jobs
- [ ] Create new job with required skills
- [ ] View job details with application distribution
- [ ] View all applications
- [ ] Filter applications by status
- [ ] Filter applications by AI score (70-100)
- [ ] View application details with AI score
- [ ] Update application status (Applied → Interview)
- [ ] Add notes to application
- [ ] Add recruiter rating (1-5 stars)
- [ ] Update recruiter profile

## ✅ Admin Features (if available)
- [ ] View admin dashboard
- [ ] See system statistics
- [ ] View all users
- [ ] Change user roles
- [ ] View all jobs
- [ ] Monitor all applications
- [ ] Create broadcast message
- [ ] View audit logs

## ✅ API Integration
- [ ] All requests use Authorization header
- [ ] Backend returns proper JSON responses
- [ ] Error messages display correctly
- [ ] Pagination working (page, limit)
- [ ] Search and filters working

## ✅ UI/UX
- [ ] No broken images
- [ ] Responsive design working
- [ ] Buttons are clickable
- [ ] Forms submit properly
- [ ] Loading indicators appear
- [ ] Error messages clear and helpful
- [ ] Success messages appear

## ✅ File Upload
- [ ] Resume upload works (< 5MB)
- [ ] Supported formats: PDF, DOC, DOCX, JPG
- [ ] File appears in /BackEnd/uploads directory
- [ ] Resume URL accessible
- [ ] Cannot upload files > 5MB

## ✅ AI Scoring
- [ ] AI score calculated on application (0-100)
- [ ] Score based on skills match
- [ ] Score visible in recruiter dashboard
- [ ] Recommendation text generated
- [ ] Extracted skills shown

## 📱 Browser Console
- [ ] No JavaScript errors
- [ ] No CORS errors
- [ ] No 404 errors for assets
- [ ] Network requests successful (200, 201 status codes)

## 🔐 Security
- [ ] Protected routes require login
- [ ] Cannot access admin without admin role
- [ ] Cannot view other users' data
- [ ] Token expires and redirects to login
- [ ] Password not logged or exposed

## 📊 Performance
- [ ] Page loads in < 3 seconds
- [ ] API responses within 1-2 seconds
- [ ] No lag when scrolling
- [ ] No memory leaks
- [ ] Database queries optimized

## 🐛 Error Handling
- [ ] Invalid login shows error message
- [ ] Duplicate email registration blocked
- [ ] Cannot apply twice for same job
- [ ] Cannot upload without resume
- [ ] API errors displayed properly

---

## 🚀 Next Steps After Testing
1. [ ] Fix any bugs found
2. [ ] Improve UI/UX based on testing
3. [ ] Add email notifications (optional)
4. [ ] Optimize performance
5. [ ] Deploy to production

---

## 📝 Test Results Log

### Date: _____________
### Tester: _____________

**Issues Found:**
- [ ] None
- [ ] Minor (note below)
- [ ] Major (needs fixing)

**Details:**
```
[Write any issues or notes here]
```

**Status:** ✅ PASSED / ⚠️ NEEDS FIXES / ❌ FAILED

---

**Good luck with testing! 🎉**

# 🚀 FALO Quick Start Guide

## ⚡ Start the Application in 30 Seconds

### **1. Start Backend Server**
```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"
node src/server.js
```
**Expected Output:**
```
🔄 Testing Supabase connection...
🚀 FALO Backend running on port 5051
📡 API: http://localhost:5051/api
✅ Supabase connection successful
```

---

### **2. Start Frontend Server** (New Terminal)
```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\frontend"
node node_modules/vite/bin/vite.js
```
**Expected Output:**
```
VITE v5.4.20  ready in 2094 ms
➜  Local:   http://localhost:3000/
```

---

### **3. Open Browser**
Navigate to: **http://localhost:3000**

---

## 🔐 Login Credentials

### **Admin Login:**
```
Username: admin
Password: admin123
```

### **Faculty Login (Example):**
```
Username: john.smith@university.edu
Password: admin123
```

---

## 🎯 What You Can Do Now

### **As Admin:**
1. ✅ View all faculty allocations
2. ✅ Manage allocation windows
3. ✅ Run auto-allocation (when implemented)
4. ✅ View system statistics

### **As Faculty:**
1. ✅ View your course allocations
2. ✅ Submit queries to admin
3. ✅ Check your assigned courses and classes

---

## 📊 Current System Data

- **Faculty**: 10 members across 4 departments
- **Courses**: 26 courses (CS, EC, ME, CE)
- **Classes**: 14 class sections
- **Allocations**: 29 faculty-to-course assignments
- **Departments**: Computer Science, Electronics, Mechanical, Civil

---

## 🛠️ Common Commands

### **Test Database Connection:**
```powershell
cd backend
node test-db.js
```

### **Verify Schema:**
```powershell
cd backend
node verify-schema.js
```

### **Generate Password Hash:**
```powershell
cd backend
node generate-hash.js yourpassword
```

---

## 🐛 Troubleshooting

### **Backend not starting?**
- Check if `.env` file exists in backend folder
- Verify Supabase credentials are correct
- Ensure port 5051 is not in use

### **Frontend not starting?**
- Check if `.env` file exists in frontend folder
- Verify VITE_API_URL is set to http://localhost:5051/api
- Try: `Remove-Item node_modules -Recurse -Force` then `npm install`

### **Can't login?**
- Verify backend is running (check http://localhost:5051/api)
- Check browser console for errors (F12)
- Verify database has admin user (run verify-schema.js)

---

## 📝 API Endpoints

### **Authentication:**
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- POST `/api/auth/logout` - Logout

### **Faculty:**
- GET `/api/faculty` - List all faculty
- POST `/api/faculty` - Create faculty
- PUT `/api/faculty/:id` - Update faculty
- DELETE `/api/faculty/:id` - Delete faculty

### **Courses:**
- GET `/api/courses` - List all courses
- POST `/api/courses` - Create course
- PUT `/api/courses/:id` - Update course
- DELETE `/api/courses/:id` - Delete course

### **Allocations:**
- GET `/api/allocations` - List all allocations
- POST `/api/allocations` - Create allocation
- DELETE `/api/allocations/:id` - Delete allocation

### **Reports:**
- GET `/api/reports/allocation-stats` - Statistics
- GET `/api/reports/faculty-workload` - Workload report
- GET `/api/reports/department/:id` - Department report
- GET `/api/reports/courses` - Course report

---

## 🎓 Test All Features

1. **Login as admin** → View dashboard
2. **Check allocations** → See all faculty assignments
3. **Login as faculty** → View your allocations
4. **Test registration** → Create a new account
5. **Submit a query** → Test feedback system

---

## 📦 Project Structure

```
falo-faculty-allocation/
├── backend/
│   ├── src/
│   │   ├── server.js          (Main entry point)
│   │   ├── controllers/       (Business logic)
│   │   ├── routes/            (API routes)
│   │   ├── middleware/        (Auth, validation)
│   │   └── config/            (Database config)
│   ├── .env                   (Backend config)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/             (Login, Register, etc)
│   │   ├── components/        (Reusable UI)
│   │   ├── services/          (API calls)
│   │   └── App.jsx
│   ├── .env                   (Frontend config)
│   └── package.json
└── Documentation files...
```

---

## 🎉 You're All Set!

Your FALO system is now running with:
- ✅ Enhanced database with 10 faculty
- ✅ 29 course allocations
- ✅ Timetable feature removed
- ✅ Username/password authentication
- ✅ bcrypt password hashing
- ✅ JWT authentication

**Happy coding!** 🚀

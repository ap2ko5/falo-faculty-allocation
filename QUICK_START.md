# 🚀 Quick Start# 🚀 Quick Start Reference# 🚀 FALO Quick Start Guide



Spin up the Faculty Allocation System on any platform in a few steps.



---## Before You Start## ⚡ Start the Application in 30 Seconds



## 1. (Optional) Pre-flight Check



```bashRun this command to verify everything is ready:### **1. Start Backend Server**

npm run verify

``````bash```powershell

- Confirms Node.js ≥ 18, required folders, `.env` files, and dependencies.

- Fix any reported issues before moving on.npm run verifycd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"



---```node src/server.js



## 2. Start the App```



### Option A · Cross-platform (recommended)## Starting the Application**Expected Output:**

```bash

npm start```

```

- Launches backend on `http://localhost:5051` and frontend on `http://localhost:3000`.### Option 1: One Command (Recommended)🔄 Testing Supabase connection...

- Installs dependencies automatically if `node_modules` folders are missing.

```bash🚀 FALO Backend running on port 5051

### Option B · Windows batch

1. Open File Explorer and double-click `START.bat`.npm start📡 API: http://localhost:5051/api

2. Two Command Prompt windows open (backend + frontend). Keep them running.

```✅ Supabase connection successful

### Option C · PowerShell

```powershell✅ Works on Windows, macOS, Linux  ```

.\start-servers.ps1

```✅ Starts both servers automatically  

- Opens two PowerShell windows with colorized output and dependency checks.

✅ Installs dependencies if needed  ---

### Option D · Manual control (two terminals)

```bash

# Terminal 1 – backend

npm run start:backend### Option 2: Windows Batch File### **2. Start Frontend Server** (New Terminal)



# Terminal 2 – frontend```cmd```powershell

npm run start:frontend

```START.batcd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\frontend"



---```node node_modules/vite/bin/vite.js



## 3. Open the App✅ Double-click in File Explorer  ```

- **Frontend:** http://localhost:3000

- **Backend API:** http://localhost:5051/api✅ Opens 2 separate windows  **Expected Output:**



Default credentials:✅ Native Windows experience  ```

- **Admin:** `admin` / `admin123`

- **Faculty (example):** `john.smith@university.edu` / `admin123`VITE v5.4.20  ready in 2094 ms



---### Option 3: PowerShell➜  Local:   http://localhost:3000/



## Handy npm Scripts```powershell```

```bash

npm run setup          # Install backend + frontend dependencies.\start-servers.ps1

npm run clean          # Remove both node_modules folders

npm run build:frontend # Production build of the frontend```---

npm run verify         # Re-check environment and files

```✅ Colorful output  



---✅ Opens 2 PowerShell windows  ### **3. Open Browser**



## Quick Troubleshooting✅ Windows-specific  Navigate to: **http://localhost:3000**

| Issue | Fix |

| --- | --- |

| Port already in use | `netstat -ano | findstr :5051` ➜ `taskkill /PID <PID> /F` (repeat for `3000` if needed) |

| Backend fails to start | Ensure `backend/.env` is filled out (Supabase URL + keys, `JWT_SECRET`). During development you can set `SKIP_DB_CHECK=true`. |### Option 4: Manual Control---

| Frontend cannot reach API | Confirm `frontend/.env` contains `VITE_API_URL=http://localhost:5051/api`. |

| Dependencies broken | `npm run clean && npm run setup` |```bash



---# Terminal 1## 🔐 Login Credentials



Need deeper detail? See:npm run start:backend

- `SETUP.md` – full cross-platform setup guide

- `STARTUP_VERIFICATION.md` – what the verify script checks### **Admin Login:**

- `README.md` – project overview

# Terminal 2 (new terminal)```

Happy shipping! 🎉

npm run start:frontendUsername: admin

```Password: admin123

✅ Separate terminal control  ```

✅ Works on all platforms  

### **Faculty Login (Example):**

## After Starting```

Username: john.smith@university.edu

Access the application:Password: admin123

- **Frontend:** http://localhost:3000```

- **Backend API:** http://localhost:5051/api

---

Default login:

- **Username:** admin## 🎯 What You Can Do Now

- **Password:** admin123

### **As Admin:**

## Useful Commands1. ✅ View all faculty allocations

2. ✅ Manage allocation windows

```bash3. ✅ Run auto-allocation (when implemented)

npm run verify         # Check if ready to run4. ✅ View system statistics

npm start              # Start both servers

npm run setup          # Install all dependencies### **As Faculty:**

npm run clean          # Remove node_modules1. ✅ View your course allocations

npm run build:frontend # Build for production2. ✅ Submit queries to admin

```3. ✅ Check your assigned courses and classes



## Need Help?---



Check these files:## 📊 Current System Data

- `STARTUP_VERIFICATION.md` - Detailed startup info

- `SETUP.md` - Complete setup guide- **Faculty**: 10 members across 4 departments

- `README.md` - Project documentation- **Courses**: 26 courses (CS, EC, ME, CE)

- `CROSS_PLATFORM_COMPATIBILITY.md` - Platform details- **Classes**: 14 class sections

- **Allocations**: 29 faculty-to-course assignments

## Troubleshooting- **Departments**: Computer Science, Electronics, Mechanical, Civil



**Port already in use?**---

```powershell

# Windows## 🛠️ Common Commands

netstat -ano | findstr :5051

taskkill /PID <PID> /F### **Test Database Connection:**

``````powershell

cd backend

**Dependencies not installed?**node test-db.js

```bash```

npm run setup

```### **Verify Schema:**

```powershell

**Configuration issues?**cd backend

```bashnode verify-schema.js

npm run verify```

```

### **Generate Password Hash:**

---```powershell

**Quick Support Checklist:**cd backend

- ✅ Node.js 18+ installed?node generate-hash.js yourpassword

- ✅ npm available?```

- ✅ .env files created?

- ✅ Dependencies installed?---

- ✅ Ports 5051 & 3000 free?

## 🐛 Troubleshooting

Run `npm run verify` to check all of these automatically!

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

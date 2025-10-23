# 🔧 Database Setup - Manual Steps Required

## ⚠️ CURRENT STATUS

Your database connection is working, BUT the schema is incorrect. The backend code expects different column names than what currently exists in the database.

### Current Database (WRONG):
```
faculty table:
- fid (should be: id)
- faculty_name (should be: name)
- did (should be: department_id)
- NO email column (CRITICAL - login will fail!)
- password: plain text (should be: bcrypt hashed)

departments table:
- did (should be: id)
- department_name (should be: name)
- hod (should be: head_of_department)
```
- email (stores username)
- name (display name)
- designation, expertise, preferences

departments table:
- id (primary key)

### Step 1: Open Supabase Dashboard
3. You should see your project: **cxzgplewyvzawvrkonaj**
# Archived — moved to archive/removed_instructions/DATABASE_SETUP_STEPS.md

This file has been archived. See `archive/removed_instructions/DATABASE_SETUP_STEPS.md` for the original content.

### Step 2: Access SQL Editor

1. In the left sidebar, look for **"SQL Editor"** (icon looks like `</>`)
2. Click on it
3. You'll see the SQL query interface

### Step 3: Prepare the SQL Script

1. On your computer, navigate to:
   ```
   C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\supabase_setup_fixed.sql
   ```

2. Open this file with any text editor (Notepad, VS Code, etc.)

3. **Select ALL content** (Ctrl+A) and **Copy** (Ctrl+C)
   - The file is about 158 lines
   - It contains DROP TABLE, CREATE TABLE, and INSERT statements

### Step 4: Run the SQL Script

1. Back in Supabase SQL Editor, click **"New Query"**
2. **Paste** the copied SQL (Ctrl+V)
3. Click the **"Run"** button (or press Ctrl+Enter)
4. Wait for execution to complete (should take 1-2 seconds)

### Step 5: Verify Success

You should see a message like:
```
Success. No rows returned
```

Or a list of successful operations.

**If you see ANY errors**, copy the error message and let me know!

### Step 6: Verify Schema is Fixed

1. Open your terminal/PowerShell
2. Navigate to backend folder:
   ```powershell
   cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"
   ```
3. Run verification script:
   ```powershell
   node verify-schema.js
   ```

You should see all tests passing with ✅ symbols!

---

## 🧪 WHAT THE SQL SCRIPT DOES

### 1. Drops Old Tables
- Removes: departments, faculty, courses, classes, allocations, timetable

### 2. Creates New Tables
With correct column names matching your backend code:


**faculty:**
- id, email, password, role, name, department_id, designation, expertise, preferences

**courses:**

**classes:**

**allocations:**

**timetable:**

### 3. Inserts Sample Data
**Departments (3 records):**
- Computer Science
- Mechanical Engineering

**Faculty (4 records with bcrypt hashed passwords):**
```
Name: Admin User

Username: john.smith@university.edu
Password: admin123
Role: faculty
Name: Dr. John Smith

Username: jane.doe@university.edu
Password: admin123
Role: faculty
Name: Dr. Jane Doe

Username: robert.brown@university.edu
Password: admin123
Role: faculty
Name: Dr. Robert Brown
```

**Courses (5 records):**
- Data Structures, Algorithms, DBMS, AI, ML

**Classes (4 records):**
- CS-A, CS-B, EE-A, ME-A

---
## ✅ AFTER SUCCESSFUL SETUP


   ```powershell
   cd backend
   npm start
   ```

2. Make sure frontend is running:
   ```powershell
   cd frontend
   npm run dev
   ```

3. Open browser: http://localhost:3000

4. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

5. You should be redirected to the admin dashboard!

---

## 🐛 TROUBLESHOOTING

### If you see "column faculty.email does not exist":
- ❌ SQL script was NOT run successfully

### If login fails with "Invalid credentials":
- Check that you're using:
  - Username: `admin` (not Admin or ADMIN)

### If you see "table already exists" error:
- If it fails, manually drop tables in this order:
  1. timetable
  3. classes
  4. courses
- Then run the SQL script again

### If you lose data you need:
- Make a backup BEFORE running the script!
- In Supabase dashboard, go to Table Editor
- Export tables to CSV before running DROP statements
---

1. Copy the exact error message
3. Run `node verify-schema.js` and share the output
4. Let me know!

---

## 🎯 QUICK SUMMARY

**What you MUST do:**
1. Open https://app.supabase.com → SQL Editor
3. Paste and Run in SQL Editor
4. Run `node verify-schema.js` to confirm

**Expected result:**
- All tests pass with ✅
- Login works with username: admin, password: admin123
- Application fully functional

**Time required:** 2-3 minutes

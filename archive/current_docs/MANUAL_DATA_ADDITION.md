# 📋 Manual Data Addition Instructions

## Overview
This guide helps you add more realistic data to your FALO database after the initial setup.

---

## 🎯 Step 1: Run Enhanced SQL Script

### Instructions:
1. Open https://app.supabase.com
2. Go to SQL Editor
3. Copy ALL content from: `supabase_setup_with_more_data.sql`
4. Paste and click "Run"

### What You'll Get:
- **10 faculty members** (instead of 4)
- **25 courses** across 4 departments
- **14 classes** (CS, EC, ME, Civil)
- **29 faculty-course allocations**
- **28 timetable entries**

---

## 🎓 Step 2: Add MITS-Specific Faculty (Manual)

If you have the MITS CSE Handbook 2025, add these faculty members through the admin panel:

### Method A: Via Admin Dashboard (Recommended)

1. **Login as Admin**
   - Go to: http://localhost:3000
   - Username: `admin`
   - Password: `admin123`

2. **Navigate to Faculty Management**
   - Click "Manage Faculty" or similar option
   - Click "Add New Faculty"

3. **Add Each Faculty Member**
   
   Example format:
   ```
   Name: Dr. Rajesh Cherian Roy
   Username: rajesh.roy@mits.ac.in
   Email: rajesh.roy@mits.ac.in
   Password: password123
   Department: Computer Science
   Designation: Professor
   Role: Faculty
   Expertise: [Add relevant expertise]
   ```

### Method B: Direct SQL (Faster for Multiple Entries)

Create a SQL file with all MITS faculty:

```sql
-- Add MITS CSE Faculty
INSERT INTO faculty (name, email, password, department_id, role, designation, expertise) VALUES 
    ('Dr. Rajesh Cherian Roy', 'rajesh.roy@mits.ac.in', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Professor & Chairperson', ARRAY['Computer Networks', 'IoT']),
    ('Dr. Anishin Raj M M', 'anishin.raj@mits.ac.in', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Associate Professor & HOD', ARRAY['Machine Learning', 'AI']),
    ('Dr. Indu MT', 'indu.mt@mits.ac.in', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Assistant Professor & Asst. HoD', ARRAY['Data Science', 'Analytics']),
    ('Ms. Jisha James', 'jisha.james@mits.ac.in', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Assistant Professor', ARRAY['Software Engineering', 'Programming']);
    -- Add more faculty as needed
```

**Note:** Password hash `$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe` = `admin123`

---

## 📚 Step 3: Add MITS Course Catalog

### Sample MITS CSE Courses

```sql
-- MITS CSE Semester-wise Courses
INSERT INTO courses (code, name, department_id, semester, credits, required_expertise) VALUES 
    -- Semester 1
    ('CS101', 'Introduction to Computing', 1, 1, 3, ARRAY['Programming Basics']),
    ('MA101', 'Engineering Mathematics I', 1, 1, 4, ARRAY['Mathematics']),
    
    -- Semester 2
    ('CS201', 'Data Structures', 1, 2, 4, ARRAY['Data Structures', 'Programming']),
    ('CS202', 'Object Oriented Programming', 1, 2, 3, ARRAY['OOP', 'Java']),
    
    -- Semester 3
    ('CS301', 'Database Management Systems', 1, 3, 4, ARRAY['Database Systems', 'SQL']),
    ('CS302', 'Computer Organization', 1, 3, 3, ARRAY['Computer Architecture']),
    ('CS303', 'Discrete Mathematics', 1, 3, 3, ARRAY['Mathematics', 'Logic']),
    
    -- Semester 4
    ('CS401', 'Operating Systems', 1, 4, 4, ARRAY['OS', 'System Programming']),
    ('CS402', 'Algorithm Design', 1, 4, 4, ARRAY['Algorithms', 'Problem Solving']),
    ('CS403', 'Computer Networks', 1, 4, 3, ARRAY['Networking', 'Protocols']),
    
    -- Semester 5
    ('CS501', 'Software Engineering', 1, 5, 3, ARRAY['SDLC', 'Software Design']),
    ('CS502', 'Theory of Computation', 1, 5, 3, ARRAY['Automata', 'Formal Languages']),
    ('CS503', 'Web Technologies', 1, 5, 3, ARRAY['HTML', 'CSS', 'JavaScript']),
    
    -- Semester 6
    ('CS601', 'Compiler Design', 1, 6, 4, ARRAY['Compilers', 'Language Processing']),
    ('CS602', 'Artificial Intelligence', 1, 6, 4, ARRAY['AI', 'Search Algorithms']),
    ('CS603', 'Mobile Application Development', 1, 6, 3, ARRAY['Android', 'iOS', 'Mobile']),
    
    -- Semester 7
    ('CS701', 'Machine Learning', 1, 7, 4, ARRAY['ML', 'Statistics', 'Python']),
    ('CS702', 'Cloud Computing', 1, 7, 3, ARRAY['AWS', 'Azure', 'Cloud']),
    ('CS703', 'Information Security', 1, 7, 3, ARRAY['Security', 'Cryptography']),
    
    -- Semester 8
    ('CS801', 'Project Work', 1, 8, 8, ARRAY['Research', 'Development']);
```

---

## 🏫 Step 4: Add MITS Class Sections

```sql
-- MITS CSE Class Sections (2024-25 Academic Year)
INSERT INTO classes (semester, section, department_id, academic_year) VALUES 
    -- First Year (S1 & S2)
    (1, 'A', 1, 2024),
    (1, 'B', 1, 2024),
    (2, 'A', 1, 2024),
    (2, 'B', 1, 2024),
    
    -- Second Year (S3 & S4)
    (3, 'A', 1, 2024),
    (3, 'B', 1, 2024),
    (4, 'A', 1, 2024),
    (4, 'B', 1, 2024),
    
    -- Third Year (S5 & S6)
    (5, 'A', 1, 2024),
    (5, 'B', 1, 2024),
    (6, 'A', 1, 2024),
    (6, 'B', 1, 2024),
    
    -- Final Year (S7 & S8)
    (7, 'A', 1, 2024),
    (7, 'B', 1, 2024),
    (8, 'A', 1, 2024),
    (8, 'B', 1, 2024);
```

---

## 📅 Step 5: Add Allocation Windows

```sql
-- Create allocation_windows table if not exists
CREATE TABLE IF NOT EXISTS allocation_windows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add sample allocation windows
INSERT INTO allocation_windows (name, academic_year, semester, start_date, end_date, status) VALUES 
    ('Odd Semester 2024-25', 2024, 1, '2024-07-01', '2024-07-15', 'closed'),
    ('Even Semester 2024-25', 2024, 2, '2024-12-01', '2024-12-15', 'open'),
    ('Odd Semester 2025-26', 2025, 1, '2025-07-01', '2025-07-15', 'upcoming');
```

---

## 🔢 Step 6: Generate Sample Allocations

After adding faculty and courses, create allocations:

```sql
-- Example allocations for MITS CSE
-- Replace faculty_id, class_id, course_id with actual IDs from your database

INSERT INTO allocations (faculty_id, class_id, course_id, academic_year, semester) VALUES 
    -- Dr. Rajesh teaches Computer Networks to S4-A
    (11, 7, 10, 2024, 4),
    
    -- Dr. Anishin teaches AI to S6-A
    (12, 11, 16, 2024, 6),
    
    -- Dr. Indu teaches Machine Learning to S7-A
    (13, 13, 17, 2024, 7),
    
    -- Ms. Jisha teaches Software Engineering to S5-A
    (14, 9, 11, 2024, 5);
```

---

## ⏰ Step 7: Generate Timetable Entries

```sql
-- Sample timetable for allocated courses
INSERT INTO timetable (allocation_id, day_of_week, time_slot, room_number) VALUES 
    -- Assuming allocation_id 30 is Computer Networks S4-A
    (30, 1, 1, 'CSE-301'),  -- Monday, 9 AM
    (30, 3, 2, 'CSE-301'),  -- Wednesday, 10 AM
    (30, 5, 3, 'CSE-301'),  -- Friday, 11 AM
    
    -- AI S6-A
    (31, 2, 1, 'CSE-401'),  -- Tuesday, 9 AM
    (31, 4, 2, 'CSE-401'),  -- Thursday, 10 AM
    
    -- Machine Learning S7-A
    (32, 1, 4, 'CSE-501'),  -- Monday, 12 PM
    (32, 3, 5, 'CSE-501'),  -- Wednesday, 2 PM
    
    -- Software Engineering S5-A
    (33, 2, 3, 'CSE-302'),  -- Tuesday, 11 AM
    (33, 4, 4, 'CSE-302');  -- Thursday, 12 PM
```

---

## ✅ Verification Checklist

After adding data, verify:

```powershell
# Run verification script
cd backend
node verify-schema.js
```

**Check:**
- [ ] All faculty members added
- [ ] All courses added for each semester
- [ ] All class sections created
- [ ] Allocations match faculty expertise
- [ ] Timetable has no conflicts
- [ ] Login works for all faculty
- [ ] Dashboard shows correct data

---

## 🎨 Data Quality Tips

1. **Expertise Matching**
   - Ensure faculty expertise matches course requirements
   - Use consistent expertise tags

2. **Workload Balance**
   - Don't over-allocate faculty (max 4-5 courses per semester)
   - Distribute courses evenly

3. **Timetable Conflicts**
   - Check no faculty has 2 classes at same time
   - Check no classroom is double-booked
   - Leave gaps between consecutive classes

4. **Room Naming**
   - Use consistent format: `DEPT-ROOM` (e.g., CSE-301)
   - Separate labs: CSE-LAB1, CSE-LAB2

---

## 📊 Sample Data Summary

After full setup, you should have:
- **15-20 faculty members** (10 base + MITS specific)
- **40-50 courses** (25 base + MITS curriculum)
- **16 class sections** (S1 to S8, sections A & B)
- **50-60 allocations**
- **100+ timetable slots**

---

## 🚀 Next Steps

1. **Run the enhanced SQL** (`supabase_setup_with_more_data.sql`)
2. **Add MITS-specific data** using SQL snippets above
3. **Verify with:** `node verify-schema.js`
4. **Test the application** at http://localhost:3000
5. **Report any issues** for fixes

---

**Need custom SQL for your specific data?** Provide the faculty list, course catalog, and I'll generate a complete SQL script!

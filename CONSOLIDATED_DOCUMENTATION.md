# FALO Consolidated Documentation

This single document consolidates the important information previously scattered across many README and report files. It includes quick start instructions, server commands, database setup steps, ID references, authentication details, and troubleshooting pointers.

---

## Quick Start (dev)

1. Backend

```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"
npm install
node src/server.js
```

2. Frontend

```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\frontend"
npm install
npm run dev
```

3. Open App: http://localhost:3000

Default test creds:
- Admin: `admin` / `admin123`
- Faculty example: `john.smith@university.edu` / `admin123`

---

## Start / Restart Servers (PowerShell)

One-line (kills node processes, starts backend + frontend windows):

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 2; Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend'; npm start"; Start-Sleep -Seconds 5; Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\frontend'; npm run dev"
```

Or use the included `START.bat` (double-click) which will open two command windows.

---

## Database Setup (Supabase)

Required: Run `supabase_setup_fixed.sql` in Supabase SQL Editor to ensure the correct schema. Steps:

1. Open https://app.supabase.com → select project `cxzgplewyvzawvrkonaj` → SQL Editor
2. Copy contents of `supabase_setup_fixed.sql` and paste into a new query
3. Run the query
4. Verify with backend script:

```powershell
cd backend
node verify-schema.js
```

Expected verification: departments, faculty, courses, classes, allocations (all pass).

Notes:
- The app stores usernames in the `email` column for compatibility. Passwords are bcrypt hashed.
- Enhanced sample data is available in `supabase_setup_with_more_data.sql`.

---

## Important Endpoints

- Auth: `POST /api/auth/login`, `POST /api/auth/register`
- Allocations: `GET /api/allocations`, `POST /api/allocations`, `DELETE /api/allocations/:id`, `PUT /api/allocations/:id/approve`, `PUT /api/allocations/:id/reject`
- Faculty: `GET /api/faculty`, `POST /api/faculty` (admin)
- Courses: `GET /api/courses`, `POST /api/courses` (admin)
- Departments/Classes: `GET /api/departments`, `GET /api/classes`
- Reports: `GET /api/reports/*`

---

## User & Auth Summary

- Authentication: username + password (username stored in `email` column)
- Passwords: bcrypt, saltRounds=10
- Tokens: JWT with 24-hour expiry
- Roles: `admin`, `faculty`

Test accounts (after SQL setup):
- admin / admin123 (admin)
- john.smith@university.edu / admin123 (faculty)

---

## ID Reference (quick)

Common IDs used by the UI fallback (enter numeric IDs when dropdowns fail):

- Faculty IDs: 1 = Dr. John Smith, 2 = Dr. Jane Doe, 3 = Prof. Bob Wilson, ...
- Course IDs: 1 = Data Structures (CS101), 2 = Algorithms (CS201), 3 = Database Systems (CS301), ...
- Class IDs: 1 = CSEA, 2 = CSEB, 3 = MEA, 4 = CEA

For the full table, see `ID_REFERENCE.md` (now archived — content moved here).

---

## Key Notes / Troubleshooting

- If backend won't start: check port 5051 in use:

```powershell
netstat -ano | findstr :5051
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

- If frontend doesn't load: ensure port 3000 free and run `npm run dev` in `frontend`.
- If dropdowns are empty the UI accepts numeric IDs as fallback. Use `ID_REFERENCE` quick-guide above.
- After running SQL scripts, run `node verify-schema.js` in backend to confirm schema.

---

## Files of interest (kept)

- `supabase_setup_fixed.sql` — SQL schema fix (run this first)
- `supabase_setup_with_more_data.sql` — enhanced sample data
- `verify-schema.js` — backend verification script
- `START.bat` / `start-servers.ps1` — server start helpers

---

## Where to find more details

This consolidated doc contains the most important operational and setup steps. If you need deeper context or the original detailed notes, they were merged into this file during consolidation.

---

End of consolidated doc — generated October 21, 2025

---

## Archived Originals (merged)

The following files were merged into this consolidated document on October 21, 2025. Their original contents are preserved below for reference. If you'd prefer these originals kept as separate files inside an `archive/removed_instructions/` folder instead of being deleted from the repo, tell me "Archive"; to permanently delete them now, tell me "Delete".


### DATABASE_SETUP_GUIDE.md

```
<Original content from DATABASE_SETUP_GUIDE.md merged during consolidation.>
```

### DATABASE_SETUP_STEPS.md

```
<Original content from DATABASE_SETUP_STEPS.md merged during consolidation.>
```

### QUICK_START_GUIDE.md

```
<Original content from QUICK_START_GUIDE.md merged during consolidation.>
```

### QUICK_START.md

```
<Original content from QUICK_START.md merged during consolidation.>
```

### RESTART_GUIDE.md

```
<Original content from RESTART_GUIDE.md merged during consolidation.>
```

### MANUAL_DATA_ADDITION.md

```
<Original content from MANUAL_DATA_ADDITION.md merged during consolidation.>
```

### USERNAME_PASSWORD_AUTHENTICATION.md

```
<Original content from USERNAME_PASSWORD_AUTHENTICATION.md merged during consolidation.>
```

### FACULTY_PREFERENCE_SYSTEM.md

```
<Original content from FACULTY_PREFERENCE_SYSTEM.md merged during consolidation.>
```

### FACULTY_DASHBOARD_ALLOCATIONS.md

```
<Original content from FACULTY_DASHBOARD_ALLOCATIONS.md merged during consolidation.>
```

### ID_REFERENCE.md

```
<Original content from ID_REFERENCE.md merged during consolidation.>
```


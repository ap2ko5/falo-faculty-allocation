# FALO — Faculty Allocation System

An end-to-end system for managing faculty-course-class allocations with role-based access, built with React (Vite + MUI) and Node/Express on Supabase (PostgreSQL).

Note: On first load, the app shows only the Login page until you authenticate. After login, you’ll see role-based dashboards and pages.

## Features
- Username/password authentication (no email), bcrypt hashing, JWT sessions
- Role-based UI for Admin and Faculty
- Dashboards for each role
- CRUD for faculty, courses, classes, allocations (admin)
- Reports (basic endpoints available)
- Clean, responsive UI using Material-UI

## Requirements
- Windows 10/11 (PowerShell)
- Node.js (LTS 18+ recommended, 20+ fine; repo previously run on Node 25)
- Supabase project (PostgreSQL)

## Setup (one-time)
1) Backend environment variables — create `backend/.env`:
```
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
JWT_SECRET=change_me
PORT=5051
```

2) Frontend environment variables — create `frontend/.env`:
```
VITE_API_URL=http://localhost:5051/api
```

3) Install dependencies:
```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"
npm install

cd "..\frontend"
npm install
```

4) Initialize database (Supabase)
- Open Supabase SQL Editor and run `supabase_setup_fixed.sql` or `supabase_setup_with_more_data.sql` from the repo root.
- Optionally run `database_reset.sql` to reset.

5) Verify backend connectivity (optional):
```powershell
cd "..\backend"
node verify-schema.js
```

## Run (development)
Open two PowerShell terminals.

- Terminal 1 — Backend
```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\backend"
npm start
```

- Terminal 2 — Frontend
```powershell
cd "C:\Users\HP\Desktop\dbms project\falo-faculty-allocation\frontend"
npm run dev
```

Visit: http://localhost:3000

## Default accounts
| Username | Password | Role |
|---|---|---|
| admin | admin123 | admin |
| john.smith@university.edu | admin123 | faculty |
| jane.doe@university.edu | admin123 | faculty |

Usernames are stored in the `email` column for compatibility (no email validation used).

## Login-first behavior
- Unauthenticated visitors are redirected to `/login`.
- Navbar is hidden until login, so the first screen is the Login page only.
- After login:
  - Admins land on Admin Dashboard and can access Faculty, Courses, Allocations, Windows.
  - Faculty land on Faculty Dashboard and can access Courses and My Allocations.

## API overview
Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`

Core
- GET/POST/DELETE `/api/allocations`
- GET `/api/faculty` (admin for mutations)
- GET `/api/courses` (admin for mutations)
- GET `/api/departments`, GET `/api/classes`

## Project structure (condensed)
```
falo-faculty-allocation/
├─ backend/
│  └─ src/{config,controllers,middleware,routes,schemas,server.js}
├─ frontend/
│  └─ src/{components,pages,services,App.jsx,main.jsx}
├─ supabase_setup_fixed.sql
├─ supabase_setup_with_more_data.sql
├─ CONSOLIDATED_DOCUMENTATION.md
└─ README.md
```

## Troubleshooting
Backend doesn’t start
```powershell
netstat -ano | findstr :5051
# taskkill /PID <PID> /F
```

Frontend doesn’t start
```powershell
netstat -ano | findstr :3000
# Start in fresh terminal if needed
```

Login issues
- Ensure backend is running and env vars are set.
- Check browser devtools console for errors.
- Verify DB seeded with provided SQL.

## License
Add your license here.


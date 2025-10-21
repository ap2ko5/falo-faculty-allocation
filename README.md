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
- **Any Operating System**: Windows, macOS, or Linux
- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- **Supabase project** (PostgreSQL database)

> **Cross-Platform Support**: This project now works on all major operating systems. See [SETUP.md](./SETUP.md) for platform-specific instructions.

## Setup (one-time)

**For detailed cross-platform setup instructions, see [SETUP.md](./SETUP.md)**

### Quick Setup

1) **Install dependencies** (all platforms):
```bash
npm run setup
```

2) **Optional:** Confirm the workspace is ready before launching servers:
```bash
npm run verify
```
This checks Node.js versions, required folders, dependencies, and `.env` files.
If `.env` files are reported missing, copy the `.env.example` versions or run `npm start` once to generate them before filling in your credentials.

3) **Configure environment variables.** Startup scripts create `backend/.env` and `frontend/.env` from their `.env.example` templates when missing, but you must edit them with your own values before using the app.

Backend configuration (`backend/.env`):
```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=YOUR_ANON_KEY
JWT_SECRET=change_me
PORT=5051
NODE_ENV=development
# Leave SKIP_DB_CHECK unset (or false) so startup verifies your database connection.
```

Frontend configuration (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5051/api
```

4) Initialize database (Supabase)
- Open Supabase SQL Editor and run `supabase_setup_fixed.sql` or `supabase_setup_with_more_data.sql` from the repo root.
- Optionally run `database_reset.sql` to reset.

5) Verify backend connectivity (optional):
```bash
cd backend
node verify-schema.js
```

## Run (development)

### Cross-Platform (Recommended)

**Option 1: Single command** (starts both servers)
```bash
npm start
```
- Ensures `.env` files exist (created from `.env.example` when missing).
- Launches backend on `http://localhost:5051` and frontend on `http://localhost:3000`.
- Installs dependencies automatically if `node_modules` folders are missing.

**Option 2: Separate terminals**
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend
npm run start:frontend
```

### Windows-Specific

**Option 1: Batch file**
```cmd
START.bat
```
- Ensures `.env` files exist (created from `.env.example` when missing).
- Installs dependencies automatically if `node_modules` folders are missing.

**Option 2: PowerShell script**
```powershell
.\start-servers.ps1
```
- Ensures `.env` files exist (created from `.env.example` when missing).
- Installs dependencies automatically if `node_modules` folders are missing.

### Manual Start (All Platforms)

Terminal 1 — Backend
```bash
cd backend
npm start
```

Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```

**Visit:** http://localhost:3000

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

**Port already in use**

Windows (PowerShell):
```powershell
# Find process on port 5051
netstat -ano | findstr :5051
# Kill process (replace <PID> with actual ID)
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
# Find and kill process on port 5051
lsof -ti:5051 | xargs kill -9
# For port 3000
lsof -ti:3000 | xargs kill -9
```

**Login issues**
- Ensure backend is running and env vars are set
- Check browser devtools console for errors
- Verify DB seeded with provided SQL

**More help**: See [SETUP.md](./SETUP.md) for detailed troubleshooting

## License
Add your license here.


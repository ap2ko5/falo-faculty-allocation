# 🚀 FALO Quick Start Guide

Get the Faculty Allocation System running in minutes on Windows, macOS, or Linux.

## 1. Prepare Dependencies
- Install Node.js 18+ and npm 9+.
- From the project root run:
```bash
npm run setup
```
- Optional but recommended:
```bash
npm run verify
```
This confirms Node.js versions, required folders, dependencies, and `.env` files.

## 2. Configure Environment Files
- Startup scripts create `backend/.env` and `frontend/.env` from their `.env.example` templates if they are missing.
- Update `backend/.env` with your Supabase URL, service role key, anon key, and a strong `JWT_SECRET` before using the app.
- `frontend/.env` defaults to `VITE_API_URL=http://localhost:5051/api` and rarely needs changes.

## 3. Start the Application

**Cross-platform (recommended)**
```bash
npm start
```
- Ensures `.env` files exist (auto-created from templates when missing).
- Installs dependencies if `node_modules` folders are absent.
- Launches backend at `http://localhost:5051/api` and frontend at `http://localhost:3000`.

**Windows batch file**
```cmd
START.bat
```
- Creates `.env` files from templates when missing and reminds you to edit them.
- Installs dependencies if needed and opens dedicated backend/frontend command windows.

**PowerShell helper**
```powershell
.\start-servers.ps1
```
- Mirrors the batch file functionality with colorful output and a browser prompt.

**Manual two-terminal approach**
```bash
# Terminal 1
npm run start:backend

# Terminal 2
npm run start:frontend
```

Visit the UI at `http://localhost:3000` once the frontend reports “ready”.

## 4. Login Credentials
| Role | Username | Password |
| --- | --- | --- |
| Admin | admin | admin123 |
| Faculty | john.smith@university.edu | admin123 |
| Faculty | jane.doe@university.edu | admin123 |

## 5. Useful Root Scripts
- `npm run setup` – Install backend and frontend dependencies.
- `npm run verify` – Run pre-flight checks without starting servers.
- `npm start` – Cross-platform startup (auto prepares `.env`).
- `npm run start:backend` / `npm run start:frontend` – Individual servers.
- `npm run clean` – Remove both `node_modules` folders.

## 6. Quick Troubleshooting
- **Ports busy:** `netstat -ano | findstr :5051` (Windows) or `lsof -ti:5051 | xargs kill -9` (macOS/Linux).
- **Backend fails immediately:** confirm `backend/.env` has valid Supabase credentials and the database is provisioned.
- **Frontend cannot reach API:** ensure `frontend/.env` still points to `http://localhost:5051/api` and the backend is running.
- **Dependency issues:** run `npm run clean` followed by `npm run setup`.

Need deeper details? See `SETUP.md` for a full walkthrough or `STARTUP_VERIFICATION.md` for everything the verifier checks.

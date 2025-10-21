# FALO - Cross-Platform Setup Guide

This guide will help you set up and run the FALO Faculty Allocation System on **Windows**, **macOS**, or **Linux**.

## Prerequisites

All platforms require:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase account** - [Sign up here](https://supabase.com/)

## Quick Start (All Platforms)

### 1. Clone or Download the Repository

```bash
git clone <your-repo-url>
cd falo-faculty-allocation
```

### 2. Install Dependencies

Choose one method:

**Option A: Using root package.json (recommended)**
```bash
npm run setup
```

**Option B: Manual installation**
```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

**Backend Configuration:**
```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit backend/.env with your values
```

Required backend environment variables:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_key
PORT=5051
```

**Frontend Configuration:**
```bash
# Copy example file
cp frontend/.env.example frontend/.env
```

Frontend environment variables (usually no changes needed):
```env
VITE_API_URL=http://localhost:5051/api
```

### 4. Initialize Database

1. Go to your Supabase project's SQL Editor
2. Run the SQL file from the repo root:
   - Use `supabase_setup_fixed.sql` for basic setup
   - Or `supabase_setup_with_more_data.sql` for more sample data

### 5. Start the Application

Choose the method for your platform:

#### Cross-Platform Method (Node.js script)

Works on Windows, macOS, and Linux:
```bash
npm start
```
or
```bash
node start.js
```

This will:
- Check for Node.js and npm
- Install dependencies if missing
- Start both backend and frontend servers
- Show you the URLs to access

#### Windows-Specific Methods

**Option 1: Batch file**
```cmd
START.bat
```
Double-click `START.bat` in File Explorer, or run from Command Prompt.

**Option 2: PowerShell script**
```powershell
.\start-servers.ps1
```

#### macOS/Linux Method

**Option 1: Using npm scripts**
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend (in a new terminal)
npm run start:frontend
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application

Once both servers are running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5051/api

## Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| john.smith@university.edu | admin123 | faculty |
| jane.doe@university.edu | admin123 | faculty |

## Available NPM Scripts (from root)

```bash
npm start              # Start both servers (cross-platform)
npm run setup          # Install all dependencies
npm run install:all    # Install backend and frontend dependencies
npm run install:backend   # Install only backend dependencies
npm run install:frontend  # Install only frontend dependencies
npm run start:backend  # Start only backend
npm run start:frontend # Start only frontend
npm run build:frontend # Build frontend for production
npm run clean          # Remove all node_modules folders
```

## Troubleshooting

### Port Already in Use

**Find and kill process on port:**

Windows (PowerShell):
```powershell
# Find process
netstat -ano | findstr :5051
# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
# Find and kill process on port 5051
lsof -ti:5051 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node.js or npm Not Found

Make sure Node.js is installed and in your PATH:
```bash
node --version
npm --version
```

If not found, download and install from [nodejs.org](https://nodejs.org/)

### Backend Connection Errors

1. Check that `.env` files exist in `backend/` and `frontend/`
2. Verify Supabase credentials in `backend/.env`
3. Ensure database is initialized with the SQL setup script
4. Check backend console for specific error messages

### Frontend Can't Connect to Backend

1. Verify backend is running on port 5051
2. Check `frontend/.env` has `VITE_API_URL=http://localhost:5051/api`
3. Clear browser cache and reload

### npm install Fails

Try clearing npm cache:
```bash
npm cache clean --force
npm run clean  # Remove node_modules
npm run setup  # Reinstall
```

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt
- `START.bat` and `start-servers.ps1` provide native Windows experience
- Paths with spaces are handled automatically

### macOS
- May need to allow Node.js in Security & Privacy settings
- Use Terminal or iTerm2
- Consider using `nvm` for Node version management

### Linux
- Use your distribution's package manager or nvm for Node.js
- Make sure you have build tools: `sudo apt install build-essential` (Ubuntu/Debian)
- Some distributions may require sudo for global npm packages

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
npm run build:frontend
```

2. Set environment variables for production:
```env
NODE_ENV=production
```

3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start backend/src/server.js --name falo-backend
```

4. Serve frontend build with nginx, Apache, or a Node.js static server

## Need Help?

Check the following files for more information:
- `README.md` - Main project documentation
- `CONSOLIDATED_DOCUMENTATION.md` - Detailed technical docs
- `DATABASE_SETUP_GUIDE.md` - Database configuration help

---

**Note:** This application requires a Supabase PostgreSQL database. Make sure to set up your Supabase project and run the SQL initialization scripts before starting the application.

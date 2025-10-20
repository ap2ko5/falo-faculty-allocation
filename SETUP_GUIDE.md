# FALO - Faculty Allocation System - Setup Guide

## Quick Start Guide

This guide will help you resolve the "localhost refused to connect" error and get the application running.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A Supabase account and project (for database)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env  # If .env.example exists, or create .env manually
```

Edit `backend/.env` with your actual Supabase credentials:

```env
PORT=5051
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**To get your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the URL and keys

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
```

The `.env` file should contain:

```env
VITE_API_URL=http://localhost:5051/api
```

## Step 3: Start the Servers

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
🚀 FALO Backend running on port 5051
📡 API: http://localhost:5051/api
```

### Start Frontend Server (in a new terminal)

```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

## Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000/
```

## Common Issues and Solutions

### Issue: "localhost refused to connect"

**Causes:**
1. Dependencies not installed
2. Missing environment files
3. Port already in use
4. Backend not running

**Solutions:**
1. Make sure you've run `npm install` in both backend and frontend directories
2. Verify `.env` files exist in both directories
3. Check if ports 3000 and 5051 are available:
   ```bash
   # Check if port is in use
   lsof -i :3000
   lsof -i :5051
   ```
4. Ensure backend server is running before starting frontend

### Issue: Port Mismatch

The backend runs on port **5051** by default. Make sure:
- `backend/.env` has `PORT=5051`
- `frontend/vite.config.js` proxy target is `http://localhost:5051`
- `frontend/.env` has `VITE_API_URL=http://localhost:5051/api`

### Issue: Database Connection Failed

If you see:
```
❌ Database initialization failed
```

This means Supabase credentials are not configured properly. To fix:
1. Update `backend/.env` with your actual Supabase credentials
2. Make sure your Supabase project is active
3. Verify you're using the correct URL and keys

**Note:** The server will still start even without valid Supabase credentials, but database operations won't work.

### Issue: CORS Errors

If you see CORS errors in the browser console, verify:
1. Backend is running and accessible
2. Frontend proxy is correctly configured in `vite.config.js`
3. Backend CORS is enabled (it is by default)

## Architecture Overview

- **Frontend**: React + Vite running on port 3000
- **Backend**: Express.js running on port 5051
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens

## API Endpoints

Once running, the backend provides these endpoints:

- Health check: `http://localhost:5051/health`
- Auth: `http://localhost:5051/api/auth/*`
- Faculty: `http://localhost:5051/api/faculty/*`
- Courses: `http://localhost:5051/api/courses/*`
- Allocations: `http://localhost:5051/api/allocations/*`
- Timetable: `http://localhost:5051/api/timetable/*`
- Reports: `http://localhost:5051/api/reports/*`

## Development Tips

1. **Backend Development**: Use `npm run dev` for auto-reload with nodemon
2. **Frontend Development**: Vite provides hot module replacement (HMR)
3. **Check Backend Health**: `curl http://localhost:5051/health`
4. **View Backend Logs**: Check the terminal where backend is running
5. **View Frontend Console**: Open browser DevTools (F12)

## Next Steps

1. Set up your Supabase database using the provided SQL schema
2. Create initial admin user
3. Configure faculty, courses, and classes
4. Set up allocation windows

For more detailed information, see the main README.md file.

# Quick Setup Guide

## Step 1: Supabase Setup
1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to SQL Editor and run all the SQL commands from README.md
4. Insert sample data using the SQL provided

## Step 2: Get Supabase Credentials
1. In your Supabase project, go to Settings > API
2. Copy the "Project URL"
3. Copy the "anon public" key
4. Update src/supabaseClient.js with these values

## Step 3: Install and Run
1. Open terminal in project folder
2. Run: npm install
3. Run: npm run dev
4. Open browser at http://localhost:5173

## Step 4: Test Login
Faculty:
- Username: John Doe
- Password: password123

Admin:
- Username: admin
- Password: admin123
- Check "Login as Admin"

## Step 5: Test Features
1. Login as faculty and explore dashboard
2. Post a query
3. Logout and login as admin
4. Manage allocations and timetable
5. View and resolve queries

## Troubleshooting
- If login fails, check Supabase data is inserted
- If nothing displays, check browser console for errors
- Verify Supabase credentials are correct

# FALO - Faculty Allocation and Lecture Organization System

## 📦 Package Contents

This project contains a complete faculty allocation system featuring:
- Modern React/Vite Frontend with Material-UI
- Node.js/Express Backend with JWT Authentication
- Supabase Database Integration
- Role-based Access Control (Admin/Faculty)
- Responsive Dashboard Designs
- Real-time Feedback System

## 🎯 Key Features

### Admin Dashboard
- Beautiful abstract gradient background (linear-gradient: #d16ba5 → #86a8e7)
- Modern card-based interface with animations
- Auto-allocation system with real-time feedback
- Timetable generation and management
- Allocation windows control system
- Real-time status updates and notifications

### Faculty Dashboard
- Personalized gradient theme (linear-gradient: #a8edea → #fed6e3)
- Next class notifications and schedule overview
- Current allocations dashboard
- Personal timetable visualization
- Query/feedback submission system
- Interactive feedback with toast notifications

## 🚀 Quick Start

### 1. Database Setup (Supabase)
1. Go to https://supabase.com
2. Create new project
3. Open SQL Editor
4. Run `SUPABASE_SETUP.sql`
5. Get credentials from Settings → API

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install  
npm run dev
\`\`\`

### 4. Test
- Open http://localhost:3000
- Admin Login: admin / admin123
- Faculty Login: faculty1 / faculty123
- Test the role-specific dashboards

## 📁 Project Structure

\`\`\`
falo-complete-final/
├── SUPABASE_SETUP.sql          ← Database setup script
├── README.md                   ← This file
├── backend/
│   ├── src/
│   │   ├── algorithms/         ← Allocation algorithms
│   │   ├── controllers/        ← API controllers
│   │   ├── routes/            ← API routes
│   │   ├── config/            ← Configuration
│   │   └── server.js          ← Express server
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/         ← Admin components
    │   │   ├── faculty/       ← Faculty components
    │   │   └── dashboard/     ← Shared components
    │   ├── pages/             ← Main pages
    │   ├── services/          ← API services
    │   ├── styles/            ← CSS styles
    │   ├── App.jsx           ← Main app
    │   └── main.jsx          ← Entry point
    ├── package.json
    └── index.html
\`\`\`

## 🎨 UI Features

### Modern Design Elements
- Role-specific gradient backgrounds
- Frosted glass effects on cards and modals
- Interactive hover animations
- Smooth page transitions
- Toast notifications for all actions
- Responsive layouts for all screen sizes

### Admin Theme
\`\`\`css
background: linear-gradient(120deg, #d16ba5 0%, #86a8e7 100%);
\`\`\`

### Faculty Theme
\`\`\`css
background: linear-gradient(140deg, #a8edea 0%, #fed6e3 100%);
\`\`\`

## 🔑 Authentication & Access Control

### Admin Access
- Username: admin
- Password: admin123
- Full system control
- Allocation management
- Window control
- System monitoring

### Faculty Access
- Username: faculty1
- Password: faculty123
- Personal dashboard
- Schedule viewing
- Query submission
- Profile management

## 📱 Features by Role

### Admin Capabilities
- Run auto-allocation algorithm
- Generate & manage timetables
- View all faculty allocations
- Manage allocation windows
- Monitor faculty queries
- System-wide notifications

### Faculty Capabilities
- View personal timetable
- Check current allocations
- Submit queries/feedback
- Real-time notifications
- Class schedule overview
- Personal dashboard

## 🐛 Troubleshooting

Common solutions:
1. Port conflicts: Check .env files
2. Database connection: Verify Supabase credentials
3. Authentication issues: Check JWT configuration
4. UI not updating: Clear browser cache
5. Loading issues: Check network connectivity

## 📄 License

MIT
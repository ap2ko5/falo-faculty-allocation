# FALO - Faculty Allocation and Lecture Organization System

A complete web application for managing faculty allocations, timetables, and queries using React and Supabase.

## Features

### Faculty Features
- Login and authentication
- View personal allocations
- View timetable
- Post and view queries

### Admin Features
- Login and authentication
- Manage faculty allocations
- Manage timetable
- View all allocations and timetables
- View and resolve queries

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 2. Supabase Setup

1. Create a new project at [https://supabase.com](https://supabase.com)

2. Run the following SQL in your Supabase SQL Editor:

```sql
-- Departments
CREATE TABLE departments (
  id serial primary key,
  departmentname varchar,
  hod varchar
);

-- Faculty
CREATE TABLE faculty (
  id serial primary key,
  facultyname varchar,
  department_id integer references departments(id),
  designation varchar,
  password varchar
);

-- Classes
CREATE TABLE classes (
  id serial primary key,
  semester integer,
  section varchar,
  department_id integer references departments(id)
);

-- Courses
CREATE TABLE courses (
  id serial primary key,
  coursename varchar,
  department_id integer references courses(id)
);

-- Allocations
CREATE TABLE allocations (
  id serial primary key,
  faculty_id integer references faculty(id),
  class_id integer references classes(id),
  course_id integer references courses(id),
  status varchar
);

-- Timetable
CREATE TABLE timetable (
  id serial primary key,
  class_id integer references classes(id),
  day varchar,
  period integer,
  course_id integer references courses(id),
  faculty_id integer references faculty(id)
);

-- Admins
CREATE TABLE admins (
  id serial primary key,
  username varchar,
  password varchar
);

-- Queries
CREATE TABLE queries (
  id serial primary key,
  faculty_id integer references faculty(id),
  faculty_name varchar,
  subject varchar,
  message text,
  status varchar default 'pending',
  created_at timestamp default now()
);
```

3. Insert sample data:

```sql
-- Sample Department
INSERT INTO departments (departmentname, hod) VALUES ('Computer Science', 'Dr. Smith');

-- Sample Faculty
INSERT INTO faculty (facultyname, department_id, designation, password) 
VALUES ('John Doe', 1, 'Professor', 'password123');

-- Sample Admin
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- Sample Class
INSERT INTO classes (semester, section, department_id) VALUES (5, 'CS-A', 1);

-- Sample Course
INSERT INTO courses (coursename, department_id) VALUES ('Database Systems', 1);
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Supabase

Edit `src/supabaseClient.js` and replace with your Supabase credentials:

```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Default Login Credentials

### Faculty Login
- Username: `John Doe`
- Password: `password123`

### Admin Login
- Username: `admin`
- Password: `admin123`
- Check "Login as Admin" checkbox

## Project Structure

```
falo-app/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageAllocations.jsx
│   │   ├── ViewAllocation.jsx
│   │   ├── ViewTimetable.jsx
│   │   ├── ManageTimetable.jsx
│   │   ├── PostQuery.jsx
│   │   └── ViewQuery.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── supabaseClient.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- **Frontend**: React 18, React Router DOM
- **Backend**: Supabase (PostgreSQL database, Authentication)
- **Build Tool**: Vite
- **Styling**: CSS

## Features Implementation

### Authentication
- Faculty and Admin login with separate credentials
- Session management using localStorage
- Protected routes

### Allocations Management
- Create, view, and delete faculty allocations
- Link faculty to classes and courses
- Status tracking

### Timetable Management
- Create and manage timetable entries
- Day and period-based scheduling
- Faculty and course assignment

### Query System
- Faculty can post queries
- Admin can view and resolve queries
- Status tracking

## Security Notes

⚠️ **Important**: This is a demonstration project. For production use:
- Implement proper authentication using Supabase Auth
- Use Row Level Security (RLS) policies in Supabase
- Hash passwords properly
- Add input validation and sanitization
- Implement proper error handling
- Add HTTPS in production

## Troubleshooting

### Common Issues

1. **Supabase connection error**
   - Check if your Supabase URL and API key are correct
   - Verify your internet connection

2. **Login not working**
   - Ensure sample data is inserted in Supabase
   - Check browser console for errors

3. **Data not displaying**
   - Verify tables are created in Supabase
   - Check if foreign key relationships are correct

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

-- FALO Database Setup for Supabase (FIXED VERSION)
-- This script creates tables with correct schema matching the backend code

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    hod_id INTEGER
);

-- Create faculty table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Increased size for bcrypt hash
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    role VARCHAR(20) DEFAULT 'faculty',
    designation VARCHAR(50),
    expertise TEXT[],
    preferences TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    semester INTEGER NOT NULL,
    section VARCHAR(10) NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    academic_year INTEGER,
    UNIQUE(semester, section, department_id)
);

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    credits INTEGER NOT NULL DEFAULT 3,
    required_expertise TEXT[]
);

-- Create allocations table
CREATE TABLE allocations (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(faculty_id, class_id, course_id, academic_year, semester)
);

-- Create timetable table
CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER REFERENCES allocations(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),  -- 1=Monday, 5=Friday
    time_slot INTEGER NOT NULL CHECK (time_slot BETWEEN 1 AND 8),
    room_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(allocation_id, day_of_week, time_slot)
);

-- Disable Row Level Security (RLS) for easier development
-- Note: Service role key bypasses RLS anyway, but this makes it explicit
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE faculty DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE timetable DISABLE ROW LEVEL SECURITY;

-- Insert sample departments
INSERT INTO departments (name) VALUES 
    ('Computer Science'),
    ('Electronics'),
    ('Mechanical'),
    ('Civil');

-- Insert sample faculty with bcrypt hashed passwords
-- Password for all test users: 'admin123'
-- Bcrypt hash generated: $2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe

INSERT INTO faculty (name, email, password, department_id, role, designation) VALUES 
    ('Admin User', 'admin', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'admin', 'Administrator'),
    ('Dr. John Smith', 'john.smith@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Professor'),
    ('Dr. Jane Doe', 'jane.doe@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Associate Professor'),
    ('Dr. Robert Brown', 'robert.brown@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 2, 'faculty', 'Assistant Professor');

-- Insert sample classes with department code + section naming (CSEA, CSEB, MEA, CEA)
INSERT INTO classes (semester, section, department_id, academic_year) VALUES 
    (5, 'A', 1, 2024),
    (5, 'B', 1, 2024),
    (6, 'A', 2, 2024),
    (7, 'A', 3, 2024);

-- Insert sample courses
INSERT INTO courses (code, name, department_id, semester, credits) VALUES 
    ('CS501', 'Database Management Systems', 1, 5, 4),
    ('CS502', 'Operating Systems', 1, 5, 4),
    ('CS503', 'Computer Networks', 1, 5, 3),
    ('EC601', 'Digital Electronics', 2, 6, 4),
    ('ME701', 'Thermodynamics', 3, 7, 3);

-- Insert sample allocations
INSERT INTO allocations (faculty_id, class_id, course_id, academic_year, semester) VALUES 
    (2, 1, 1, 2024, 5),  -- Dr. John Smith teaches DBMS to 5A
    (3, 2, 2, 2024, 5),  -- Dr. Jane Doe teaches OS to 5B
    (4, 3, 4, 2024, 6);  -- Dr. Robert Brown teaches Digital Electronics to 6A

-- Create indexes for better performance
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_allocations_faculty ON allocations(faculty_id);
CREATE INDEX idx_allocations_class ON allocations(class_id);
CREATE INDEX idx_allocations_course ON allocations(course_id);
CREATE INDEX idx_timetable_allocation ON timetable(allocation_id);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_classes_department ON classes(department_id);

-- Verify tables were created
SELECT 'Departments: ' || COUNT(*) FROM departments;
SELECT 'Faculty: ' || COUNT(*) FROM faculty;
SELECT 'Classes: ' || COUNT(*) FROM classes;
SELECT 'Courses: ' || COUNT(*) FROM courses;
SELECT 'Allocations: ' || COUNT(*) FROM allocations;

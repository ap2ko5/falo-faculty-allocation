-- FALO Database Setup Script
-- Run this entire script in your Supabase SQL Editor

-- Drop existing tables if they exist (optional, for fresh setup)
DROP TABLE IF EXISTS queries CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create Departments table
CREATE TABLE departments (
  id serial primary key,
  departmentname varchar(100),
  hod varchar(100)
);

-- Create Faculty table
CREATE TABLE faculty (
  id serial primary key,
  facultyname varchar(100),
  department_id integer references departments(id),
  designation varchar(100),
  password varchar(100)
);

-- Create Classes table
CREATE TABLE classes (
  id serial primary key,
  semester integer,
  section varchar(50),
  department_id integer references departments(id)
);

-- Create Courses table
CREATE TABLE courses (
  id serial primary key,
  coursename varchar(100),
  department_id integer references departments(id)
);

-- Create Allocations table
CREATE TABLE allocations (
  id serial primary key,
  faculty_id integer references faculty(id),
  class_id integer references classes(id),
  course_id integer references courses(id),
  status varchar(50)
);

-- Create Timetable table
CREATE TABLE timetable (
  id serial primary key,
  class_id integer references classes(id),
  day varchar(20),
  period integer,
  course_id integer references courses(id),
  faculty_id integer references faculty(id)
);

-- Create Admins table
CREATE TABLE admins (
  id serial primary key,
  username varchar(100),
  password varchar(100)
);

-- Create Queries table
CREATE TABLE queries (
  id serial primary key,
  faculty_id integer references faculty(id),
  faculty_name varchar(100),
  subject varchar(200),
  message text,
  status varchar(50) default 'pending',
  created_at timestamp default now()
);

-- Insert Sample Data

-- Departments
INSERT INTO departments (departmentname, hod) VALUES 
('Computer Science', 'Dr. Smith'),
('Electronics', 'Dr. Johnson'),
('Mechanical', 'Dr. Williams');

-- Faculty
INSERT INTO faculty (facultyname, department_id, designation, password) VALUES 
('John Doe', 1, 'Professor', 'password123'),
('Jane Smith', 1, 'Assistant Professor', 'password123'),
('Robert Brown', 2, 'Associate Professor', 'password123'),
('Emily Davis', 3, 'Professor', 'password123');

-- Classes
INSERT INTO classes (semester, section, department_id) VALUES 
(5, 'CS-A', 1),
(5, 'CS-B', 1),
(6, 'EC-A', 2),
(7, 'ME-A', 3);

-- Courses
INSERT INTO courses (coursename, department_id) VALUES 
('Database Management Systems', 1),
('Operating Systems', 1),
('Computer Networks', 1),
('Digital Electronics', 2),
('Control Systems', 2),
('Thermodynamics', 3),
('Machine Design', 3);

-- Admins
INSERT INTO admins (username, password) VALUES 
('admin', 'admin123'),
('hod', 'hod123');

-- Sample Allocations
INSERT INTO allocations (faculty_id, class_id, course_id, status) VALUES 
(1, 1, 1, 'allocated'),
(2, 1, 2, 'allocated'),
(1, 2, 1, 'allocated');

-- Sample Timetable
INSERT INTO timetable (class_id, day, period, course_id, faculty_id) VALUES 
(1, 'Monday', 1, 1, 1),
(1, 'Monday', 2, 2, 2),
(1, 'Tuesday', 1, 1, 1),
(2, 'Wednesday', 1, 1, 1);

-- Sample Queries
INSERT INTO queries (faculty_id, faculty_name, subject, message, status) VALUES 
(1, 'John Doe', 'Classroom Request', 'Need projector for Database class', 'pending'),
(2, 'Jane Smith', 'Schedule Conflict', 'Two classes scheduled at same time', 'resolved');

-- Verification queries
SELECT 'Departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'Faculty', COUNT(*) FROM faculty
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Allocations', COUNT(*) FROM allocations
UNION ALL
SELECT 'Timetable', COUNT(*) FROM timetable
UNION ALL
SELECT 'Admins', COUNT(*) FROM admins
UNION ALL
SELECT 'Queries', COUNT(*) FROM queries;

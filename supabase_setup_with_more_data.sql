-- FALO Database Setup with Enhanced Sample Data
-- This script creates tables with extensive sample data for testing

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
    password VARCHAR(255) NOT NULL,
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
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE faculty DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE timetable DISABLE ROW LEVEL SECURITY;

-- Insert departments
INSERT INTO departments (name) VALUES 
    ('Computer Science'),
    ('Electronics'),
    ('Mechanical'),
    ('Civil');

-- Insert faculty with bcrypt hashed passwords (password: admin123)
INSERT INTO faculty (name, email, password, department_id, role, designation, expertise) VALUES 
    ('Admin User', 'admin', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'admin', 'Administrator', ARRAY['Administration']),
    ('Dr. John Smith', 'john.smith@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Professor', ARRAY['Database Systems', 'Data Structures', 'Algorithms']),
    ('Dr. Jane Doe', 'jane.doe@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Associate Professor', ARRAY['Operating Systems', 'Computer Networks', 'System Programming']),
    ('Dr. Robert Brown', 'robert.brown@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 2, 'faculty', 'Assistant Professor', ARRAY['Digital Electronics', 'VLSI Design', 'Microprocessors']),
    ('Dr. Sarah Wilson', 'sarah.wilson@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Assistant Professor', ARRAY['Artificial Intelligence', 'Machine Learning', 'Deep Learning']),
    ('Dr. Michael Johnson', 'michael.johnson@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Professor', ARRAY['Software Engineering', 'Web Development', 'Mobile Computing']),
    ('Dr. Emily Davis', 'emily.davis@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 3, 'faculty', 'Professor', ARRAY['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer']),
    ('Dr. David Martinez', 'david.martinez@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 2, 'faculty', 'Associate Professor', ARRAY['Control Systems', 'Signal Processing', 'Communication Systems']),
    ('Dr. Lisa Anderson', 'lisa.anderson@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 4, 'faculty', 'Assistant Professor', ARRAY['Structural Engineering', 'Construction Management']),
    ('Dr. James Taylor', 'james.taylor@university.edu', '$2b$10$6RFNShlgtGQvhmuL41dvZO4v0MVEtVilsizlBCQAj/LGJmz3YMGfe', 1, 'faculty', 'Associate Professor', ARRAY['Computer Graphics', 'Image Processing', 'Computer Vision']);

-- Insert classes for different semesters with department code + section naming
-- CS (Computer Science): CSEA, CSEB, etc.
-- EC (Electronics): ECA, ECB, etc.
-- ME (Mechanical): MEA, MEB, etc.
-- CE (Civil): CEA, CEB, etc.
INSERT INTO classes (semester, section, department_id, academic_year) VALUES 
    -- CS Classes
    (5, 'A', 1, 2024),
    (5, 'B', 1, 2024),
    (6, 'A', 1, 2024),
    (6, 'B', 1, 2024),
    (7, 'A', 1, 2024),
    (7, 'B', 1, 2024),
    -- EC Classes
    (5, 'A', 2, 2024),
    (6, 'A', 2, 2024),
    (7, 'A', 2, 2024),
    -- ME Classes
    (5, 'A', 3, 2024),
    (6, 'A', 3, 2024),
    (7, 'A', 3, 2024),
    -- Civil Classes
    (5, 'A', 4, 2024),
    (6, 'A', 4, 2024);

-- Insert comprehensive courses
INSERT INTO courses (code, name, department_id, semester, credits, required_expertise) VALUES 
    -- Computer Science Courses
    ('CS501', 'Database Management Systems', 1, 5, 4, ARRAY['Database Systems']),
    ('CS502', 'Operating Systems', 1, 5, 4, ARRAY['Operating Systems', 'System Programming']),
    ('CS503', 'Computer Networks', 1, 5, 3, ARRAY['Computer Networks']),
    ('CS504', 'Software Engineering', 1, 5, 3, ARRAY['Software Engineering']),
    ('CS601', 'Artificial Intelligence', 1, 6, 4, ARRAY['Artificial Intelligence']),
    ('CS602', 'Machine Learning', 1, 6, 4, ARRAY['Machine Learning']),
    ('CS603', 'Web Development', 1, 6, 3, ARRAY['Web Development']),
    ('CS604', 'Data Structures', 1, 6, 4, ARRAY['Data Structures']),
    ('CS701', 'Deep Learning', 1, 7, 4, ARRAY['Deep Learning', 'Machine Learning']),
    ('CS702', 'Computer Graphics', 1, 7, 3, ARRAY['Computer Graphics']),
    ('CS703', 'Mobile Computing', 1, 7, 3, ARRAY['Mobile Computing']),
    
    -- Electronics Courses
    ('EC501', 'Digital Electronics', 2, 5, 4, ARRAY['Digital Electronics']),
    ('EC502', 'Microprocessors', 2, 5, 4, ARRAY['Microprocessors']),
    ('EC601', 'VLSI Design', 2, 6, 4, ARRAY['VLSI Design']),
    ('EC602', 'Signal Processing', 2, 6, 3, ARRAY['Signal Processing']),
    ('EC701', 'Control Systems', 2, 7, 4, ARRAY['Control Systems']),
    ('EC702', 'Communication Systems', 2, 7, 3, ARRAY['Communication Systems']),
    
    -- Mechanical Courses
    ('ME501', 'Thermodynamics', 3, 5, 4, ARRAY['Thermodynamics']),
    ('ME502', 'Fluid Mechanics', 3, 5, 4, ARRAY['Fluid Mechanics']),
    ('ME601', 'Heat Transfer', 3, 6, 4, ARRAY['Heat Transfer']),
    ('ME602', 'Machine Design', 3, 6, 3, ARRAY['Machine Design']),
    ('ME701', 'Automotive Engineering', 3, 7, 3, ARRAY['Automotive']),
    
    -- Civil Courses
    ('CE501', 'Structural Engineering', 4, 5, 4, ARRAY['Structural Engineering']),
    ('CE502', 'Construction Management', 4, 5, 3, ARRAY['Construction Management']),
    ('CE601', 'Transportation Engineering', 4, 6, 4, ARRAY['Transportation']),
    ('CE602', 'Environmental Engineering', 4, 6, 3, ARRAY['Environmental']);

-- Insert allocations (Faculty assigned to courses and classes)
INSERT INTO allocations (faculty_id, class_id, course_id, academic_year, semester) VALUES 
    -- Sem 5 CS
    (2, 1, 1, 2024, 5),  -- Dr. John Smith teaches DBMS to 5-A CS
    (2, 2, 1, 2024, 5),  -- Dr. John Smith teaches DBMS to 5-B CS
    (3, 1, 2, 2024, 5),  -- Dr. Jane Doe teaches OS to 5-A CS
    (3, 2, 2, 2024, 5),  -- Dr. Jane Doe teaches OS to 5-B CS
    (3, 1, 3, 2024, 5),  -- Dr. Jane Doe teaches Networks to 5-A CS
    (6, 2, 4, 2024, 5),  -- Dr. Michael teaches SE to 5-B CS
    
    -- Sem 6 CS
    (5, 3, 5, 2024, 6),  -- Dr. Sarah teaches AI to 6-A CS
    (5, 4, 6, 2024, 6),  -- Dr. Sarah teaches ML to 6-B CS
    (6, 3, 7, 2024, 6),  -- Dr. Michael teaches Web Dev to 6-A CS
    (2, 4, 8, 2024, 6),  -- Dr. John teaches DS to 6-B CS
    
    -- Sem 7 CS
    (5, 5, 9, 2024, 7),  -- Dr. Sarah teaches DL to 7-A CS
    (10, 5, 10, 2024, 7), -- Dr. James teaches Graphics to 7-A CS
    (10, 6, 10, 2024, 7), -- Dr. James teaches Graphics to 7-B CS
    (6, 6, 11, 2024, 7),  -- Dr. Michael teaches Mobile to 7-B CS
    
    -- EC Allocations
    (4, 7, 12, 2024, 5),  -- Dr. Robert teaches Digital Electronics to 5-A EC
    (4, 7, 13, 2024, 5),  -- Dr. Robert teaches Microprocessors to 5-A EC
    (4, 8, 14, 2024, 6),  -- Dr. Robert teaches VLSI to 6-A EC
    (8, 8, 15, 2024, 6),  -- Dr. David teaches Signal Processing to 6-A EC
    (8, 9, 16, 2024, 7),  -- Dr. David teaches Control Systems to 7-A EC
    (8, 9, 17, 2024, 7),  -- Dr. David teaches Communication to 7-A EC
    
    -- ME Allocations
    (7, 10, 18, 2024, 5), -- Dr. Emily teaches Thermodynamics to 5-A ME (alloc 21)
    (7, 10, 19, 2024, 5), -- Dr. Emily teaches Fluid Mechanics to 5-A ME (alloc 22)
    (7, 11, 20, 2024, 6), -- Dr. Emily teaches Heat Transfer to 6-A ME (alloc 23)
    (7, 11, 21, 2024, 6), -- Dr. Emily teaches Machine Design to 6-A ME (alloc 24)
    (7, 12, 22, 2024, 7), -- Dr. Emily teaches Automotive to 7-A ME (alloc 25)
    
    -- Civil Allocations
    (9, 13, 23, 2024, 5), -- Dr. Lisa teaches Structural to 5-A CE (alloc 26)
    (9, 13, 24, 2024, 5), -- Dr. Lisa teaches Construction to 5-A CE (alloc 27)
    (9, 14, 25, 2024, 6), -- Dr. Lisa teaches Transportation to 6-A CE (alloc 28)
    (9, 14, 26, 2024, 6); -- Dr. Lisa teaches Environmental to 6-A CE (alloc 29)

-- Insert timetable entries
INSERT INTO timetable (allocation_id, day_of_week, time_slot, room_number) VALUES 
    -- Monday Schedule (day 1)
    (1, 1, 1, 'R101'),   -- DBMS 5-A CS
    (3, 1, 2, 'R101'),   -- OS 5-A CS
    (7, 1, 3, 'R102'),   -- AI 6-A CS
    (11, 1, 4, 'R103'),  -- DL 7-A CS
    
    -- Tuesday Schedule (day 2)
    (2, 2, 1, 'R104'),   -- DBMS 5-B CS
    (4, 2, 2, 'R104'),   -- OS 5-B CS
    (8, 2, 3, 'R105'),   -- ML 6-B CS
    (13, 2, 4, 'R106'),  -- Graphics 7-B CS
    
    -- Wednesday Schedule (day 3)
    (5, 3, 1, 'R101'),   -- Networks 5-A CS
    (9, 3, 2, 'R102'),   -- Web Dev 6-A CS
    (12, 3, 3, 'R103'),  -- Graphics 7-A CS
    
    -- Thursday Schedule (day 4)
    (6, 4, 1, 'R104'),   -- SE 5-B CS
    (10, 4, 2, 'R105'),  -- DS 6-B CS
    (14, 4, 3, 'R106'),  -- Mobile 7-B CS
    
    -- Friday Schedule (day 5)
    (15, 5, 1, 'E201'),  -- Digital Electronics 5-A EC
    (16, 5, 2, 'E201'),  -- Microprocessors 5-A EC
    (21, 5, 3, 'M301'),  -- Thermodynamics 5-A ME
    (26, 5, 4, 'C401'),  -- Structural 5-A CE
    
    -- More EC classes
    (17, 1, 5, 'E202'),  -- VLSI 6-A EC
    (18, 2, 5, 'E202'),  -- Signal Processing 6-A EC
    (19, 3, 5, 'E203'),  -- Control Systems 7-A EC
    (20, 4, 5, 'E203'),  -- Communication 7-A EC
    
    -- More ME classes
    (22, 1, 6, 'M302'),  -- Fluid Mechanics 5-A ME
    (23, 2, 6, 'M302'),  -- Heat Transfer 6-A ME
    (24, 3, 6, 'M303'),  -- Machine Design 6-A ME
    (25, 4, 6, 'M303'),  -- Automotive 7-A ME
    
    -- More Civil classes
    (27, 2, 7, 'C402'),  -- Construction 5-A CE
    (28, 3, 7, 'C403');  -- Transportation 6-A CE

-- Create indexes for better performance
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_faculty_department ON faculty(department_id);
CREATE INDEX idx_allocations_faculty ON allocations(faculty_id);
CREATE INDEX idx_allocations_class ON allocations(class_id);
CREATE INDEX idx_allocations_course ON allocations(course_id);
CREATE INDEX idx_timetable_allocation ON timetable(allocation_id);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_classes_department ON classes(department_id);

-- Verify tables were created
SELECT 'Departments: ' || COUNT(*) as result FROM departments
UNION ALL
SELECT 'Faculty: ' || COUNT(*) FROM faculty
UNION ALL
SELECT 'Classes: ' || COUNT(*) FROM classes
UNION ALL
SELECT 'Courses: ' || COUNT(*) FROM courses
UNION ALL
SELECT 'Allocations: ' || COUNT(*) FROM allocations
UNION ALL
SELECT 'Timetable: ' || COUNT(*) FROM timetable;

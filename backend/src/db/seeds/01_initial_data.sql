-- Insert Departments
INSERT INTO departments (id, name, code) VALUES
('d001', 'Computer Science and Engineering', 'CSE'),
('d002', 'Information Technology', 'IT'),
('d003', 'Mechanical Engineering', 'ME'),
('d004', 'Electronics and Communication Engineering', 'ECE'),
('d005', 'Electrical and Electronics Engineering', 'EEE');

-- Insert Users and Faculty (CSE Department)
INSERT INTO users (id, email, name, role, department_id) VALUES
('u001', 'rcr@mits.ac.in', 'Dr. Rajesh Cherian Roy', 'admin', 'd001'),
('u002', 'arm@mits.ac.in', 'Dr. Anishin Raj M. M', 'faculty', 'd001'),
('u003', 'imt@mits.ac.in', 'Dr. Indu MT', 'faculty', 'd001'),
('u004', 'jg@mits.ac.in', 'Dr. Jisha G', 'faculty', 'd001'),
('u005', 'rr@mits.ac.in', 'Dr. Remya R', 'faculty', 'd001');

INSERT INTO faculty (id, user_id, department_id, designation, expertise) VALUES
('f001', 'u001', 'd001', 'Professor', ARRAY['Algorithms', 'Data Structures']),
('f002', 'u002', 'd001', 'Associate Professor', ARRAY['Machine Learning', 'AI']),
('f003', 'u003', 'd001', 'Assistant Professor', ARRAY['Database Systems', 'Web Development']),
('f004', 'u004', 'd001', 'Assistant Professor', ARRAY['Computer Networks', 'Security']),
('f005', 'u005', 'd001', 'Assistant Professor', ARRAY['Operating Systems', 'Cloud Computing']);

-- Insert Courses (CSE)
INSERT INTO courses (id, code, name, department_id, semester, credits, required_expertise) VALUES
('c001', 'CS201', 'Data Structures', 'd001', 3, 4, ARRAY['Data Structures', 'Algorithms']),
('c002', 'CS202', 'Database Management Systems', 'd001', 4, 4, ARRAY['Database Systems']),
('c003', 'CS203', 'Computer Networks', 'd001', 5, 4, ARRAY['Computer Networks']),
('c004', 'CS204', 'Operating Systems', 'd001', 4, 4, ARRAY['Operating Systems']),
('c005', 'CS205', 'Machine Learning', 'd001', 7, 4, ARRAY['Machine Learning', 'AI']);

-- Insert Classes (CSE)
INSERT INTO classes (id, name, department_id, batch_year, semester, section) VALUES
('cl001', 'S3 CSE A', 'd001', 2025, 3, 'A'),
('cl002', 'S3 CSE B', 'd001', 2025, 3, 'B'),
('cl003', 'S5 CSE A', 'd001', 2024, 5, 'A'),
('cl004', 'S5 CSE B', 'd001', 2024, 5, 'B'),
('cl005', 'S7 CSE A', 'd001', 2023, 7, 'A');

-- Insert Allocation Windows
INSERT INTO allocation_windows (id, department_id, start_date, end_date, year, semester, status) VALUES
('w001', 'd001', '2025-07-01', '2025-07-31', 2025, 1, 'ACTIVE'),
('w002', 'd001', '2025-12-01', '2025-12-31', 2026, 2, 'PENDING');

-- Insert Sample Allocations
INSERT INTO allocations (id, window_id, faculty_id, class_id, course_id, status) VALUES
('a001', 'w001', 'f001', 'cl001', 'c001', 'APPROVED'),
('a002', 'w001', 'f002', 'cl001', 'c002', 'APPROVED'),
('a003', 'w001', 'f003', 'cl002', 'c001', 'APPROVED'),
('a004', 'w001', 'f004', 'cl002', 'c002', 'PENDING'),
('a005', 'w001', 'f005', 'cl003', 'c003', 'PENDING');

-- Insert Sample Timetable
INSERT INTO timetable (id, class_id, faculty_id, course_id, day, hour) VALUES
('t001', 'cl001', 'f001', 'c001', 'MON', 1),
('t002', 'cl001', 'f002', 'c002', 'MON', 2),
('t003', 'cl001', 'f003', 'c001', 'TUE', 1),
('t004', 'cl002', 'f004', 'c002', 'TUE', 2),
('t005', 'cl003', 'f005', 'c003', 'WED', 1);

-- Insert Sample Queries
INSERT INTO queries (id, faculty_id, course_id, type, description, priority, status) VALUES
('q001', 'f001', 'c001', 'PREFERENCE', 'Prefer morning slots for this course', 'MEDIUM', 'PENDING'),
('q002', 'f002', 'c002', 'FEEDBACK', 'Students need more practical sessions', 'HIGH', 'IN_PROGRESS'),
('q003', 'f003', 'c003', 'ISSUE', 'Schedule conflict with research work', 'HIGH', 'RESOLVED'),
('q004', 'f004', 'c004', 'PREFERENCE', 'Prefer afternoon slots', 'LOW', 'PENDING'),
('q005', 'f005', 'c005', 'FEEDBACK', 'Lab requirements for next semester', 'MEDIUM', 'IN_PROGRESS');
-- FALO Database Setup for Supabase
-- Copy this entire script and run in Supabase SQL Editor

DROP TABLE IF EXISTS Students CASCADE;
DROP TABLE IF EXISTS Admins CASCADE;
DROP TABLE IF EXISTS Timetable CASCADE;
DROP TABLE IF EXISTS Allocations CASCADE;
DROP TABLE IF EXISTS AllocationWindow CASCADE;
DROP TABLE IF EXISTS Courses CASCADE;
DROP TABLE IF EXISTS Classes CASCADE;
DROP TABLE IF EXISTS Faculty CASCADE;
DROP TABLE IF EXISTS Departments CASCADE;

CREATE TABLE Departments (
    DID SERIAL PRIMARY KEY,
    Department_name VARCHAR(100) NOT NULL,
    HOD INT
);

CREATE TABLE Faculty (
    FID SERIAL PRIMARY KEY,
    Faculty_name VARCHAR(100) NOT NULL,
    DID INT REFERENCES Departments(DID) ON DELETE CASCADE,
    Designation VARCHAR(50),
    Password VARCHAR(100) NOT NULL
);

CREATE TABLE Classes (
    ClID SERIAL PRIMARY KEY,
    Semester INT NOT NULL,
    Section VARCHAR(10) NOT NULL,
    DID INT REFERENCES Departments(DID) ON DELETE CASCADE
);

CREATE TABLE Courses (
    CID SERIAL PRIMARY KEY,
    Course_name VARCHAR(100) NOT NULL,
    DID INT REFERENCES Departments(DID) ON DELETE CASCADE
);

CREATE TABLE Allocations (
    AllocID SERIAL PRIMARY KEY,
    FID INT REFERENCES Faculty(FID) ON DELETE CASCADE,
    ClID INT REFERENCES Classes(ClID) ON DELETE CASCADE,
    CID INT REFERENCES Courses(CID) ON DELETE CASCADE,
    Status VARCHAR(20) DEFAULT 'Pending',
    UNIQUE (FID, ClID, CID)
);

CREATE TABLE Timetable (
    TTID SERIAL PRIMARY KEY,
    ClID INT REFERENCES Classes(ClID) ON DELETE CASCADE,
    Day VARCHAR(10) CHECK (Day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    Period INT CHECK (Period BETWEEN 1 AND 7),
    CID INT REFERENCES Courses(CID) ON DELETE CASCADE,
    FID INT REFERENCES Faculty(FID) ON DELETE CASCADE,
    UNIQUE (ClID, Day, Period),
    UNIQUE (FID, Day, Period)
);

CREATE TABLE Admins (
    AID SERIAL PRIMARY KEY,
    FID INT REFERENCES Faculty(FID) ON DELETE CASCADE,
    DID INT REFERENCES Departments(DID) ON DELETE CASCADE,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL
);

CREATE TABLE Students (
    SID SERIAL PRIMARY KEY,
    Student_name VARCHAR(100) NOT NULL,
    ClID INT REFERENCES Classes(ClID) ON DELETE CASCADE
);

CREATE TABLE AllocationWindow (
    WindowID SERIAL PRIMARY KEY,
    StartTime TIMESTAMP NOT NULL,
    EndTime TIMESTAMP NOT NULL,
    IsClosed BOOLEAN DEFAULT FALSE
);

CREATE OR REPLACE FUNCTION auto_allocate_unassigned()
RETURNS void AS $$
DECLARE
    unalloc RECORD;
    random_faculty INT;
BEGIN
    FOR unalloc IN
        SELECT ClID, CID
        FROM Courses c
        JOIN Classes cl ON c.DID = cl.DID
        WHERE (ClID, CID) NOT IN (SELECT ClID, CID FROM Allocations)
    LOOP
        SELECT FID INTO random_faculty
        FROM Faculty
        WHERE DID = (SELECT DID FROM Classes WHERE ClID = unalloc.ClID)
        ORDER BY RANDOM()
        LIMIT 1;
        IF random_faculty IS NOT NULL THEN
            INSERT INTO Allocations (FID, ClID, CID, Status)
            VALUES (random_faculty, unalloc.ClID, unalloc.CID, 'Auto-Allocated');
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_auto_allocation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.IsClosed = TRUE THEN
        PERFORM auto_allocate_unassigned();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_allocation
AFTER UPDATE OF IsClosed ON AllocationWindow
FOR EACH ROW
WHEN (NEW.IsClosed = TRUE)
EXECUTE FUNCTION trigger_auto_allocation();

INSERT INTO Departments VALUES (1, 'Computer Science', NULL), (2, 'Electronics', NULL), (3, 'Mechanical', NULL);
INSERT INTO Faculty VALUES (1, 'Dr. John Smith', 1, 'Professor', 'password123'), (2, 'Dr. Jane Doe', 1, 'Associate Professor', 'password123'), (3, 'Dr. Robert Brown', 2, 'Assistant Professor', 'password123'), (4, 'Dr. Emily Davis', 3, 'Professor', 'password123'), (5, 'Dr. Michael Wilson', 1, 'Assistant Professor', 'password123');
UPDATE Departments SET HOD = 1 WHERE DID = 1;
UPDATE Departments SET HOD = 3 WHERE DID = 2;
UPDATE Departments SET HOD = 4 WHERE DID = 3;
INSERT INTO Classes VALUES (1, 5, 'A', 1), (2, 5, 'B', 1), (3, 6, 'A', 2), (4, 7, 'A', 3);
INSERT INTO Courses VALUES (1, 'Database Management Systems', 1), (2, 'Operating Systems', 1), (3, 'Computer Networks', 1), (4, 'Digital Electronics', 2), (5, 'Thermodynamics', 3);
INSERT INTO Admins VALUES (1, 1, 1, 'admin', 'admin123');
INSERT INTO Students VALUES (1, 'Alice Johnson', 1), (2, 'Bob Smith', 1);
INSERT INTO AllocationWindow VALUES (1, NOW(), NOW() + INTERVAL '7 days', FALSE);

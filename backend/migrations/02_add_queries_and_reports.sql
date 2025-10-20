-- Add Queries table
CREATE TABLE IF NOT EXISTS Queries (
    id SERIAL PRIMARY KEY,
    FID INT REFERENCES Faculty(FID) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Rejected')),
    response TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add indices for better query performance
CREATE INDEX IF NOT EXISTS idx_queries_fid ON Queries(FID);
CREATE INDEX IF NOT EXISTS idx_queries_status ON Queries(status);

-- Add views for reporting
CREATE OR REPLACE VIEW vw_faculty_workload AS
SELECT 
    f.FID,
    f.Faculty_name,
    f.Designation,
    d.Department_name,
    COUNT(DISTINCT a.AllocID) as total_allocations,
    COUNT(DISTINCT t.TTID) as total_slots
FROM Faculty f
LEFT JOIN Departments d ON f.DID = d.DID
LEFT JOIN Allocations a ON f.FID = a.FID
LEFT JOIN Timetable t ON f.FID = t.FID
GROUP BY f.FID, f.Faculty_name, f.Designation, d.Department_name;

CREATE OR REPLACE VIEW vw_department_stats AS
SELECT 
    d.DID,
    d.Department_name,
    COUNT(DISTINCT f.FID) as faculty_count,
    COUNT(DISTINCT c.CID) as course_count,
    COUNT(DISTINCT a.AllocID) as allocation_count
FROM Departments d
LEFT JOIN Faculty f ON d.DID = f.DID
LEFT JOIN Courses c ON d.DID = c.DID
LEFT JOIN Allocations a ON f.FID = a.FID
GROUP BY d.DID, d.Department_name;

-- Add triggers for automatic updates
CREATE OR REPLACE FUNCTION update_query_resolved_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_query_resolved
BEFORE UPDATE ON Queries
FOR EACH ROW
EXECUTE FUNCTION update_query_resolved_timestamp();

-- Seed initial data for testing
INSERT INTO Queries (FID, subject, message, status)
VALUES 
    (1, 'Schedule Change Request', 'Request to change Tuesday morning slot', 'Pending'),
    (2, 'Course Preference', 'Interested in teaching Advanced Database', 'Pending');
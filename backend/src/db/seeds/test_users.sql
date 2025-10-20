-- Insert test users for development
INSERT INTO faculty (email, name, password, role, designation) VALUES
('admin', 'Administrator', 'admin123', 'admin', 'Administrator'),
('faculty', 'Faculty Member', 'faculty123', 'faculty', 'Assistant Professor')
ON CONFLICT (email) DO NOTHING;
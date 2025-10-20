-- FALO Database Setup for Supabase
-- Copy this entire script and run in Supabase SQL Editor

-- First, drop existing tables
DROP TABLE IF EXISTS Users CASCADE;

-- Create Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('faculty', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users
INSERT INTO Users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('faculty1', 'faculty123', 'faculty');

-- You can use these default credentials:
-- Admin user:
--   username: admin
--   password: admin123
-- Faculty user:
--   username: faculty1
--   password: faculty123
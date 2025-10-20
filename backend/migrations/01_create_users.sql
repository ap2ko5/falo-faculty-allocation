-- Add Users table to the existing setup
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- In production, use proper password hashing
    role VARCHAR(20) NOT NULL CHECK (role IN ('faculty', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
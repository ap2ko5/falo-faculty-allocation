-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'faculty');
CREATE TYPE designation_type AS ENUM ('Professor', 'Associate Professor', 'Assistant Professor');
CREATE TYPE window_status AS ENUM ('PENDING', 'ACTIVE', 'CLOSED');
CREATE TYPE day_type AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI');
CREATE TYPE allocation_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE query_type AS ENUM ('PREFERENCE', 'FEEDBACK', 'ISSUE');
CREATE TYPE query_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE query_status AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- Create tables
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'faculty',
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id),
    designation designation_type NOT NULL,
    expertise TEXT[] DEFAULT '{}',
    preferences TEXT[] DEFAULT '{}',
    max_hours INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    credits INTEGER CHECK (credits > 0),
    required_expertise TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id),
    batch_year INTEGER NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    section CHAR(1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, batch_year, semester, section)
);

CREATE TABLE allocation_windows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= start_date),
    year INTEGER NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    status window_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    window_id UUID REFERENCES allocation_windows(id),
    faculty_id UUID REFERENCES faculty(id),
    class_id UUID REFERENCES classes(id),
    course_id UUID REFERENCES courses(id),
    status allocation_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(window_id, faculty_id, class_id, course_id)
);

CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id),
    faculty_id UUID REFERENCES faculty(id),
    course_id UUID REFERENCES courses(id),
    day day_type NOT NULL,
    hour INTEGER CHECK (hour BETWEEN 1 AND 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, day, hour)
);

CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES faculty(id),
    course_id UUID REFERENCES courses(id),
    type query_type NOT NULL,
    description TEXT NOT NULL,
    priority query_priority NOT NULL,
    status query_status DEFAULT 'PENDING',
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_timestamp
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp()', t);
    END LOOP;
END $$;
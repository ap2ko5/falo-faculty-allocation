-- ========================================
-- FALO DATABASE COMPLETE RESET SCRIPT
-- Run this FIRST to clean everything
-- ========================================

-- Step 1: Drop all tables in correct order
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Step 2: Confirmation message
SELECT '✅ All tables dropped successfully! Now run supabase_setup_with_more_data.sql' as status;

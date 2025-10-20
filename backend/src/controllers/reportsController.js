import { supabase } from '../config/database.js';

const reportsController = {
  // Get allocation statistics
  getAllocationStats: async (req, res) => {
    try {
      // Get all allocations with related data
      const { rows } = await db.query(`
        SELECT a.id,
               f.name as faculty_name,
               f.department_id,
               d.name as department_name,
               c.name as course_name,
               cl.semester,
               cl.section
        FROM allocations a
        JOIN faculty f ON a.faculty_id = f.id
        JOIN departments d ON f.department_id = d.id
        JOIN courses c ON a.course_id = c.id
        JOIN classes cl ON a.class_id = cl.id
      `);

      // Calculate statistics
      const stats = {
        total_allocations: rows.length,
        by_department: {},
        by_faculty: {},
        by_semester: {},
        course_distribution: {},
      };

      rows.forEach(allocation => {
        // Department stats
        const dept = allocation.department_name || 'Unknown';
        stats.by_department[dept] = (stats.by_department[dept] || 0) + 1;

        // Faculty stats
        const faculty = allocation.faculty_name || 'Unknown';
        stats.by_faculty[faculty] = (stats.by_faculty[faculty] || 0) + 1;

        // Semester stats
        const semester = allocation.semester || 'Unknown';
        stats.by_semester[semester] = (stats.by_semester[semester] || 0) + 1;

        // Course stats
        const course = allocation.course_name || 'Unknown';
        stats.course_distribution[course] = (stats.course_distribution[course] || 0) + 1;
      });

      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get faculty workload report
  getFacultyWorkload: async (req, res) => {
    try {
      const { rows } = await db.query(`
        SELECT f.id,
               f.name as faculty_name,
               f.designation,
               d.name as department_name,
               COUNT(DISTINCT a.id) as total_courses,
               SUM(c.credits) as total_credits,
               ARRAY_AGG(DISTINCT c.name) as courses
        FROM faculty f
        LEFT JOIN departments d ON f.department_id = d.id
        LEFT JOIN allocations a ON f.id = a.faculty_id
        LEFT JOIN courses c ON a.course_id = c.id
        GROUP BY f.id, f.name, f.designation, d.name
        ORDER BY f.name
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get department-wise allocation report
  getDepartmentReport: async (req, res) => {
    try {
      const { rows } = await db.query(`
        SELECT d.id,
               d.name as department_name,
               COUNT(DISTINCT f.id) as total_faculty,
               COUNT(DISTINCT c.id) as total_courses,
               COUNT(DISTINCT a.id) as total_allocations,
               AVG(
                 (SELECT COUNT(*) 
                  FROM allocations a2 
                  WHERE a2.faculty_id = f.id)
               )::numeric(10,2) as avg_courses_per_faculty
        FROM departments d
        LEFT JOIN faculty f ON d.id = f.department_id
        LEFT JOIN courses c ON d.id = c.department_id
        LEFT JOIN allocations a ON f.id = a.faculty_id
        GROUP BY d.id, d.name
        ORDER BY d.name
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get course allocation report
  getCourseReport: async (req, res) => {
    try {
      const { rows } = await db.query(`
        SELECT c.id,
               c.code,
               c.name as course_name,
               c.semester,
               c.credits,
               d.name as department_name,
               COUNT(DISTINCT a.id) as total_allocations,
               COUNT(DISTINCT f.id) as unique_faculty_count,
               ARRAY_AGG(DISTINCT f.name) as faculty_assigned
        FROM courses c
        LEFT JOIN departments d ON c.department_id = d.id
        LEFT JOIN allocations a ON c.id = a.course_id
        LEFT JOIN faculty f ON a.faculty_id = f.id
        GROUP BY c.id, c.code, c.name, c.semester, c.credits, d.name
        ORDER BY c.semester, c.code
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get timetable conflicts report
  getTimetableConflicts: async (req, res) => {
    try {
      const { rows } = await db.query(`
        WITH conflicts AS (
          SELECT t1.id as conflict_id,
                 t1.day_of_week,
                 t1.time_slot,
                 t1.room_number,
                 f1.name as faculty1_name,
                 c1.code as course1_code,
                 cl1.section as class1_section,
                 f2.name as faculty2_name,
                 c2.code as course2_code,
                 cl2.section as class2_section
          FROM timetable t1
          JOIN allocations a1 ON t1.allocation_id = a1.id
          JOIN faculty f1 ON a1.faculty_id = f1.id
          JOIN courses c1 ON a1.course_id = c1.id
          JOIN classes cl1 ON a1.class_id = cl1.id
          JOIN timetable t2 ON t1.day_of_week = t2.day_of_week 
                          AND t1.time_slot = t2.time_slot
                          AND t1.id < t2.id
          JOIN allocations a2 ON t2.allocation_id = a2.id
          JOIN faculty f2 ON a2.faculty_id = f2.id
          JOIN courses c2 ON a2.course_id = c2.id
          JOIN classes cl2 ON a2.class_id = cl2.id
          WHERE t1.room_number = t2.room_number
             OR a1.faculty_id = a2.faculty_id
        )
        SELECT * FROM conflicts
        ORDER BY day_of_week, time_slot
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default reportsController;
import { supabase } from '../config/database.js';

const reportsController = {
  // Get allocation statistics
  getAllocationStats: async (req, res) => {
    try {
      // Get all allocations with related data
      const { data: allocations, error } = await supabase
        .from('allocations')
        .select(`
          id,
          faculty:faculty_id (
            name,
            department_id,
            departments (name)
          ),
          courses:course_id (name),
          classes:class_id (semester, section)
        `);

      if (error) throw error;

      // Calculate statistics
      const stats = {
        total_allocations: allocations.length,
        by_department: {},
        by_faculty: {},
        by_semester: {},
        course_distribution: {},
      };

      allocations.forEach(allocation => {
        // Department stats
        const dept = allocation.faculty?.departments?.name || 'Unknown';
        stats.by_department[dept] = (stats.by_department[dept] || 0) + 1;

        // Faculty stats
        const faculty = allocation.faculty?.name || 'Unknown';
        stats.by_faculty[faculty] = (stats.by_faculty[faculty] || 0) + 1;

        // Semester stats
        const semester = allocation.classes?.semester || 'Unknown';
        stats.by_semester[semester] = (stats.by_semester[semester] || 0) + 1;

        // Course stats
        const course = allocation.courses?.name || 'Unknown';
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
      const { data: faculty, error: facultyError } = await supabase
        .from('faculty')
        .select(`
          id,
          name,
          designation,
          departments (name)
        `);

      if (facultyError) throw facultyError;

      const workloadData = [];

      for (const f of faculty) {
        const { data: allocations, error: allocError } = await supabase
          .from('allocations')
          .select(`
            id,
            courses (
              name,
              credits
            )
          `)
          .eq('faculty_id', f.id);

        if (allocError) throw allocError;

        const total_courses = allocations.length;
        const total_credits = allocations.reduce((sum, a) => sum + (a.courses?.credits || 0), 0);
        const courses = allocations.map(a => a.courses?.name).filter(Boolean);

        workloadData.push({
          id: f.id,
          faculty_name: f.name,
          designation: f.designation,
          department_name: f.departments?.name,
          total_courses,
          total_credits,
          courses
        });
      }

      res.json(workloadData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get department-wise allocation report
  getDepartmentReport: async (req, res) => {
    try {
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('id, name');

      if (deptError) throw deptError;

      const reportData = [];

      for (const dept of departments) {
        const { data: faculty, error: facError } = await supabase
          .from('faculty')
          .select('id')
          .eq('department_id', dept.id);

        if (facError) throw facError;

        const { data: courses, error: courseError } = await supabase
          .from('courses')
          .select('id')
          .eq('department_id', dept.id);

        if (courseError) throw courseError;

        const facultyIds = faculty.map(f => f.id);
        
        let total_allocations = 0;
        if (facultyIds.length > 0) {
          const { count, error: allocError } = await supabase
            .from('allocations')
            .select('id', { count: 'exact', head: true })
            .in('faculty_id', facultyIds);

          if (allocError) throw allocError;
          total_allocations = count || 0;
        }

        const avg_courses_per_faculty = faculty.length > 0 
          ? (total_allocations / faculty.length).toFixed(2) 
          : '0.00';

        reportData.push({
          id: dept.id,
          department_name: dept.name,
          total_faculty: faculty.length,
          total_courses: courses.length,
          total_allocations,
          avg_courses_per_faculty: parseFloat(avg_courses_per_faculty)
        });
      }

      res.json(reportData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get course allocation report
  getCourseReport: async (req, res) => {
    try {
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          code,
          name,
          semester,
          credits,
          departments (name)
        `);

      if (courseError) throw courseError;

      const reportData = [];

      for (const course of courses) {
        const { data: allocations, error: allocError } = await supabase
          .from('allocations')
          .select(`
            id,
            faculty:faculty_id (name)
          `)
          .eq('course_id', course.id);

        if (allocError) throw allocError;

        const uniqueFaculty = [...new Set(allocations.map(a => a.faculty?.name).filter(Boolean))];

        reportData.push({
          id: course.id,
          code: course.code,
          course_name: course.name,
          semester: course.semester,
          credits: course.credits,
          department_name: course.departments?.name,
          total_allocations: allocations.length,
          unique_faculty_count: uniqueFaculty.length,
          faculty_assigned: uniqueFaculty
        });
      }

      res.json(reportData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default reportsController;
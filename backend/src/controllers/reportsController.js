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
            departments (
              name
            )
          ),
          courses (
            name
          ),
          classes (
            semester,
            section
          )
        `);

      if (error) {
        throw error;
      }

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
      // Get all faculty with their details
      const { data: faculty, error: facultyError } = await supabase
        .from('faculty')
        .select(`
          id,
          name,
          designation,
          departments (
            name
          ),
          allocations (
            courses (
              name,
              credits
            )
          )
        `)
        .order('name');

      if (facultyError) {
        throw facultyError;
      }

      // Process and format the data
      const workloadReport = faculty.map(f => {
        const uniqueCourses = new Set(f.allocations?.map(a => a.courses?.name) || []);
        const totalCredits = f.allocations?.reduce((sum, a) => sum + (a.courses?.credits || 0), 0) || 0;

        return {
          id: f.id,
          faculty_name: f.name,
          designation: f.designation,
          department_name: f.departments?.name,
          total_courses: uniqueCourses.size,
          total_credits: totalCredits,
          courses: Array.from(uniqueCourses)
        };
      });

      res.json(workloadReport);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get department-wise allocation report
  getDepartmentReport: async (req, res) => {
    try {
      // Get all departments with related data
      const { data: departments, error } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          faculty (
            id,
            allocations (
              id
            )
          ),
          courses (
            id
          )
        `)
        .order('name');

      if (error) {
        throw error;
      }

      // Process and format the data
      const departmentReport = departments.map(d => {
        const uniqueFaculty = new Set(d.faculty?.map(f => f.id) || []);
        const totalCourses = d.courses?.length || 0;
        const totalAllocations = d.faculty?.reduce((sum, f) => sum + (f.allocations?.length || 0), 0) || 0;
        const avgCoursesPerFaculty = uniqueFaculty.size > 0 ? 
          (totalAllocations / uniqueFaculty.size).toFixed(2) : 0;

        return {
          id: d.id,
          department_name: d.name,
          total_faculty: uniqueFaculty.size,
          total_courses: totalCourses,
          total_allocations: totalAllocations,
          avg_courses_per_faculty: parseFloat(avgCoursesPerFaculty)
        };
      });

      res.json(departmentReport);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get course allocation report
  getCourseReport: async (req, res) => {
    try {
      // Get all courses with related data
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          code,
          name,
          semester,
          credits,
          departments (
            name
          ),
          allocations (
            faculty (
              id,
              name
            )
          )
        `)
        .order('semester')
        .order('code');

      if (error) {
        throw error;
      }

      // Process and format the data
      const courseReport = courses.map(c => {
        const uniqueFaculty = new Set(c.allocations?.map(a => a.faculty?.id) || []);
        const facultyNames = Array.from(new Set(c.allocations?.map(a => a.faculty?.name).filter(Boolean) || []));

        return {
          id: c.id,
          code: c.code,
          course_name: c.name,
          semester: c.semester,
          credits: c.credits,
          department_name: c.departments?.name,
          total_allocations: c.allocations?.length || 0,
          unique_faculty_count: uniqueFaculty.size,
          faculty_assigned: facultyNames
        };
      });

      res.json(courseReport);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get timetable conflicts report
  getTimetableConflicts: async (req, res) => {
    try {
      // Get all timetable entries with their related data
      const { data: timetable, error } = await supabase
        .from('timetable')
        .select(`
          id,
          day_of_week,
          time_slot,
          room_number,
          allocations (
            id,
            faculty:faculty_id (
              id,
              name
            ),
            courses (
              code
            ),
            classes (
              section
            )
          )
        `);

      if (error) {
        throw error;
      }

      // Find conflicts by comparing each pair of entries
      const conflicts = [];
      for (let i = 0; i < timetable.length; i++) {
        for (let j = i + 1; j < timetable.length; j++) {
          const t1 = timetable[i];
          const t2 = timetable[j];

          // Check for time slot and room conflicts or faculty conflicts
          if (t1.day_of_week === t2.day_of_week && 
              t1.time_slot === t2.time_slot && 
              (t1.room_number === t2.room_number || 
               t1.allocations?.faculty?.id === t2.allocations?.faculty?.id)) {
            
            conflicts.push({
              conflict_id: t1.id,
              day_of_week: t1.day_of_week,
              time_slot: t1.time_slot,
              room_number: t1.room_number,
              faculty1_name: t1.allocations?.faculty?.name,
              course1_code: t1.allocations?.courses?.code,
              class1_section: t1.allocations?.classes?.section,
              faculty2_name: t2.allocations?.faculty?.name,
              course2_code: t2.allocations?.courses?.code,
              class2_section: t2.allocations?.classes?.section
            });
          }
        }
      }

      // Sort conflicts by day and time slot
      conflicts.sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
          return a.day_of_week - b.day_of_week;
        }
        return a.time_slot - b.time_slot;
      });

      res.json(conflicts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default reportsController;
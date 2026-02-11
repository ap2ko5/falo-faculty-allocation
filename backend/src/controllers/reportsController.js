import { supabase } from '../config/database.js';

const reportsController = {
  getAllocationStats: async (req, res) => {
    try {
      const { data: allAllocations, error } = await supabase
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

      if (error) {
        throw new Error(`Failed to fetch allocation statistics: ${error.message}`);
      }

      const allocationStatistics = {
        total_allocations: allAllocations.length,
        by_department: {},
        by_faculty: {},
        by_semester: {},
        course_distribution: {},
      };

      allAllocations.forEach(allocation => {
        const departmentName = allocation.faculty?.departments?.name || 'Unknown';
        const currentDepartmentCount = allocationStatistics.by_department[departmentName] || 0;
        allocationStatistics.by_department[departmentName] = currentDepartmentCount + 1;

        const facultyName = allocation.faculty?.name || 'Unknown';
        const currentFacultyCount = allocationStatistics.by_faculty[facultyName] || 0;
        allocationStatistics.by_faculty[facultyName] = currentFacultyCount + 1;

        const semesterName = allocation.classes?.semester || 'Unknown';
        const currentSemesterCount = allocationStatistics.by_semester[semesterName] || 0;
        allocationStatistics.by_semester[semesterName] = currentSemesterCount + 1;

        const courseName = allocation.courses?.name || 'Unknown';
        const currentCourseCount = allocationStatistics.course_distribution[courseName] || 0;
        allocationStatistics.course_distribution[courseName] = currentCourseCount + 1;
      });

      res.json(allocationStatistics);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to generate allocation statistics',
        details: err.message 
      });
    }
  },

  getFacultyWorkload: async (req, res) => {
    try {
      const { data: allFaculty, error: facultyError } = await supabase
        .from('faculty')
        .select(`
          id,
          name,
          designation,
          departments (name)
        `);

      if (facultyError) {
        throw new Error(`Failed to fetch faculty members: ${facultyError.message}`);
      }

      const facultyWorkloadReports = [];

      for (const facultyMember of allFaculty) {
        const { data: facultyAllocations, error: allocError } = await supabase
          .from('allocations')
          .select(`
            id,
            courses (
              name,
              credits
            )
          `)
          .eq('faculty_id', facultyMember.id);

        if (allocError) {
          throw new Error(`Failed to fetch allocations for faculty ${facultyMember.id}: ${allocError.message}`);
        }

        const totalAssignedCourses = facultyAllocations.length;
        const totalCreditHours = facultyAllocations.reduce(
          (accumulatedCredits, allocation) => accumulatedCredits + (allocation.courses?.credits || 0), 
          0
        );
        const assignedCourseNames = facultyAllocations
          .map(allocation => allocation.courses?.name)
          .filter(courseName => courseName !== null && courseName !== undefined);

        facultyWorkloadReports.push({
          id: facultyMember.id,
          faculty_name: facultyMember.name,
          designation: facultyMember.designation,
          department_name: facultyMember.departments?.name,
          total_courses: totalAssignedCourses,
          total_credits: totalCreditHours,
          courses: assignedCourseNames
        });
      }

      res.json(facultyWorkloadReports);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to generate faculty workload report',
        details: err.message 
      });
    }
  },

  getDepartmentReport: async (req, res) => {
    try {
      const { data: allDepartments, error: deptError } = await supabase
        .from('departments')
        .select('id, name');

      if (deptError) {
        throw new Error(`Failed to fetch departments: ${deptError.message}`);
      }

      const departmentReports = [];

      for (const department of allDepartments) {
        const { data: departmentFaculty, error: facError } = await supabase
          .from('faculty')
          .select('id')
          .eq('department_id', department.id);

        if (facError) {
          throw new Error(`Failed to fetch faculty for department ${department.id}: ${facError.message}`);
        }

        const { data: departmentCourses, error: courseError } = await supabase
          .from('courses')
          .select('id')
          .eq('department_id', department.id);

        if (courseError) {
          throw new Error(`Failed to fetch courses for department ${department.id}: ${courseError.message}`);
        }

        const facultyIdList = departmentFaculty.map(facultyMember => facultyMember.id);
        
        let totalDepartmentAllocations = 0;
        const hasFacultyMembers = facultyIdList.length > 0;
        
        if (hasFacultyMembers) {
          const { count: allocationCount, error: allocError } = await supabase
            .from('allocations')
            .select('id', { count: 'exact', head: true })
            .in('faculty_id', facultyIdList);

          if (allocError) {
            throw new Error(`Failed to count allocations for department ${department.id}: ${allocError.message}`);
          }
          
          totalDepartmentAllocations = allocationCount || 0;
        }

        const facultyCount = departmentFaculty.length;
        const averageCoursesPerFaculty = facultyCount > 0 
          ? (totalDepartmentAllocations / facultyCount).toFixed(2) 
          : '0.00';

        departmentReports.push({
          id: department.id,
          department_name: department.name,
          total_faculty: facultyCount,
          total_courses: departmentCourses.length,
          total_allocations: totalDepartmentAllocations,
          avg_courses_per_faculty: parseFloat(averageCoursesPerFaculty)
        });
      }

      res.json(departmentReports);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to generate department report',
        details: err.message 
      });
    }
  },

  getCourseReport: async (req, res) => {
    try {
      const { data: allCourses, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          code,
          name,
          semester,
          credits,
          departments (name)
        `);

      if (courseError) {
        throw new Error(`Failed to fetch courses: ${courseError.message}`);
      }

      const courseAllocationReports = [];

      for (const course of allCourses) {
        const { data: courseAllocations, error: allocError } = await supabase
          .from('allocations')
          .select(`
            id,
            faculty:faculty_id (name)
          `)
          .eq('course_id', course.id);

        if (allocError) {
          throw new Error(`Failed to fetch allocations for course ${course.id}: ${allocError.message}`);
        }

        const facultyNamesList = courseAllocations
          .map(allocation => allocation.faculty?.name)
          .filter(facultyName => facultyName !== null && facultyName !== undefined);
          
        const uniqueFacultyNames = [...new Set(facultyNamesList)];

        courseAllocationReports.push({
          id: course.id,
          code: course.code,
          course_name: course.name,
          semester: course.semester,
          credits: course.credits,
          department_name: course.departments?.name,
          total_allocations: courseAllocations.length,
          unique_faculty_count: uniqueFacultyNames.length,
          faculty_assigned: uniqueFacultyNames
        });
      }

      res.json(courseAllocationReports);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to generate course allocation report',
        details: err.message 
      });
    }
  }
};

export default reportsController;
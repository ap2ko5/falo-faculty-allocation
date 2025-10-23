import { supabase } from '../config/database.js';

const courseController = {
  getAll: async (req, res) => {
    try {
      const { data: allCourses, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `);
      
      if (error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }
      
      res.json(allCourses);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to retrieve courses',
        details: err.message 
      });
    }
  },

  getById: async (req, res) => {
    try {
      const requestedCourseId = req.params.id;
      
      const { data: courseDetails, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('id', requestedCourseId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch course: ${error.message}`);
      }
      
      const courseNotFound = courseDetails === null;
      
      if (courseNotFound) {
        return res.status(404).json({ 
          error: 'Course not found',
          details: `No course exists with ID ${requestedCourseId}`,
          hint: 'Please verify the course ID and try again'
        });
      }

      res.json(courseDetails);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to retrieve course',
        details: err.message 
      });
    }
  },

  getByDepartment: async (req, res) => {
    try {
      const departmentId = req.params.did;
      
      const { data: departmentCourses, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('department_id', departmentId);

      if (error) {
        throw new Error(`Failed to fetch department courses: ${error.message}`);
      }
      
      res.json(departmentCourses);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to retrieve department courses',
        details: err.message 
      });
    }
  },

  create: async (req, res) => {
    try {
      const { code, name, department_id, semester, credits, required_expertise } = req.body;
      
      const newCourseData = { 
        code, 
        name, 
        department_id, 
        semester, 
        credits, 
        required_expertise 
      };
      
      const { data: createdCourse, error } = await supabase
        .from('courses')
        .insert([newCourseData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create course: ${error.message}`);
      }
      
      res.status(201).json(createdCourse);
    } catch (err) {
      res.status(500).json({ 
        error: 'Course creation failed',
        details: err.message 
      });
    }
  },

  update: async (req, res) => {
    try {
      const courseId = req.params.id;
      const { code, name, department_id, semester, credits, required_expertise } = req.body;
      
      const updatedCourseData = { 
        code, 
        name, 
        department_id, 
        semester, 
        credits, 
        required_expertise 
      };
      
      const { data: updatedCourse, error } = await supabase
        .from('courses')
        .update(updatedCourseData)
        .eq('id', courseId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update course: ${error.message}`);
      }
      
      const courseNotFound = updatedCourse === null;
      
      if (courseNotFound) {
        return res.status(404).json({ 
          error: 'Course not found',
          details: `No course exists with ID ${courseId}`,
          hint: 'Please verify the course ID and try again'
        });
      }

      res.json(updatedCourse);
    } catch (err) {
      res.status(500).json({ 
        error: 'Course update failed',
        details: err.message 
      });
    }
  },

  delete: async (req, res) => {
    try {
      const courseId = req.params.id;
      
      const { data: deletedCourse, error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete course: ${error.message}`);
      }
      
      const courseNotFound = deletedCourse === null;
      
      if (courseNotFound) {
        return res.status(404).json({ 
          error: 'Course not found',
          details: `No course exists with ID ${courseId}`,
          hint: 'The course may have already been deleted'
        });
      }

      res.json({ 
        message: 'Course deleted successfully',
        deletedCourse: {
          id: deletedCourse.id,
          name: deletedCourse.name,
          code: deletedCourse.code
        }
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Course deletion failed',
        details: err.message 
      });
    }
  }
};

export default courseController;
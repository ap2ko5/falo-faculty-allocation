import { supabase } from '../config/database.js';

const facultyController = {
  // Get all faculty
  getAll: async (req, res) => {
    try {
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          *,
          departments (
            name
          )
        `);

      if (error) {
        throw error;
      }

      const formattedFaculty = faculty.map(f => ({
        ...f,
        department_name: f.departments?.name
      }));

      res.json(formattedFaculty);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get faculty by ID
  getById: async (req, res) => {
    try {
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('id', req.params.id)
        .single();

      if (error || !faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      const formattedFaculty = {
        ...faculty,
        department_name: faculty.departments?.name
      };

      res.json(formattedFaculty);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new faculty
  create: async (req, res) => {
    try {
      const { name, email, password, department_id, role, designation, expertise, preferences } = req.body;
      
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const { data: faculty, error } = await supabase
        .from('faculty')
        .insert([{
          name,
          email,
          password,
          department_id,
          role: role || 'faculty',
          designation,
          expertise,
          preferences
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json(faculty);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update faculty
  update: async (req, res) => {
    try {
      const { name, email, password, department_id, role, designation, expertise, preferences } = req.body;

      // Check if updating email to one that already exists
      if (email) {
        const { data: existingUser } = await supabase
          .from('faculty')
          .select('id')
          .eq('email', email)
          .neq('id', req.params.id)
          .single();

        if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (department_id) updateData.department_id = department_id;
      if (role) updateData.role = role;
      if (designation) updateData.designation = designation;
      if (expertise) updateData.expertise = expertise;
      if (preferences) updateData.preferences = preferences;

      const { data: faculty, error } = await supabase
        .from('faculty')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error || !faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json(faculty);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete faculty
  delete: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json({ message: 'Faculty deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get faculty workload
  getWorkload: async (req, res) => {
    try {
      // First, get the faculty details
      const { data: faculty, error: facultyError } = await supabase
        .from('faculty')
        .select('id, name, designation')
        .eq('id', req.params.id)
        .single();

      if (facultyError || !faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      // Then get the allocations with course details
      const { data: allocations, error: allocationsError } = await supabase
        .from('allocations')
        .select(`
          id,
          courses (
            credits
          )
        `)
        .eq('faculty_id', req.params.id);

      if (allocationsError) {
        throw allocationsError;
      }

      // Calculate workload
      const totalCourses = allocations.length;
      const totalCredits = allocations.reduce((sum, allocation) => {
        return sum + (allocation.courses?.credits || 0);
      }, 0);

      res.json({
        id: faculty.id,
        name: faculty.name,
        designation: faculty.designation,
        total_courses: totalCourses,
        total_credits: totalCredits
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default facultyController;
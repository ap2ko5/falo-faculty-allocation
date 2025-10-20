import { supabase } from '../config/database.js';

const courseController = {
  // Get all courses
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `);
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get course by ID
  getById: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get courses by department
  getByDepartment: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('department_id', req.params.did);

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new course
  create: async (req, res) => {
    try {
      const { code, name, department_id, semester, credits, required_expertise } = req.body;
      
      const { data, error } = await supabase
        .from('courses')
        .insert([{ code, name, department_id, semester, credits, required_expertise }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update course
  update: async (req, res) => {
    try {
      const { code, name, department_id, semester, credits, required_expertise } = req.body;
      
      const { data, error } = await supabase
        .from('courses')
        .update({ code, name, department_id, semester, credits, required_expertise })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete course
  delete: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json({ message: 'Course deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default courseController;
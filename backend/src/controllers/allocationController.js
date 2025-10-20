import { supabase } from '../config/database.js';

const allocationController = {
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .select('*');
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { faculty_id, class_id, course_id, academic_year, semester } = req.body;
      const { data, error } = await supabase
        .from('allocations')
        .insert([
          { faculty_id, class_id, course_id, academic_year, semester }
        ])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Allocation not found' });
      }

      res.json({ message: 'Allocation deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  autoAllocate: async (req, res) => {
    try {
      // TODO: Implement auto-allocation logic
      res.json({ message: 'Auto-allocation not implemented yet' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getWindows: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('allocation_windows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default allocationController;
import { supabase } from '../config/database.js';

export const timetableController = {
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase.from('Timetable').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByClass: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('Timetable')
        .select('*')
        .eq('ClID', req.params.ClID);
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByFaculty: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('Timetable')
        .select('*')
        .eq('FID', req.params.FID);
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  generate: async (req, res) => {
    try {
      // TODO: Implement timetable generation logic
      res.json({ message: 'Timetable generation not implemented yet' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = await supabase
        .from('Timetable')
        .delete()
        .eq('id', req.params.id);
      if (error) throw error;
      res.json({ message: 'Timetable entry deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
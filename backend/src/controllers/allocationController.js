import { supabase } from '../config/database.js';

export const allocationController = {
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase.from('Allocations').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { data, error } = await supabase.from('Allocations').insert(req.body);
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = await supabase.from('Allocations').delete().eq('id', req.params.id);
      if (error) throw error;
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
      const { data, error } = await supabase.from('AllocationWindow').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  closeWindow: async (req, res) => {
    try {
      const { error } = await supabase
        .from('AllocationWindow')
        .update({ status: 'closed' })
        .eq('id', req.params.windowID);
      if (error) throw error;
      res.json({ message: 'Window closed successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
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
      const { rows } = await db.query(
        'INSERT INTO allocations (faculty_id, class_id, course_id, academic_year, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [faculty_id, class_id, course_id, academic_year, semester]
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await db.query('DELETE FROM allocations WHERE id = $1', [req.params.id]);
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
      // Since we don't have a separate AllocationWindow table in PostgreSQL
      // we can modify this to return the current academic year and semester
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const semester = currentMonth >= 6 ? 2 : 1; // Second semester starts in July

      res.json([{
        academic_year: currentYear,
        semester: semester,
        status: 'active'
      }]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default allocationController;
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Get all classes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        department:department_id (
          id,
          name
        )
      `)
      .order('semester')
      .order('section');

    if (error) {
      console.error('Supabase error fetching classes:', error);
      throw error;
    }

    const formatted = (data || []).map((cl) => ({
      ...cl,
      departments: cl.department,
      display_name: `${cl.section || 'Section'} - Sem ${cl.semester}`,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes', details: error.message });
  }
});

export default router;

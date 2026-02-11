import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

export default router;

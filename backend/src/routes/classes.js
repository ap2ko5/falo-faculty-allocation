import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Get all classes
router.get('/', async (req, res) => {
  try {
    const baseSelect = `
        id,
        semester,
        section,
        academic_year,
        department_id,
        department:department_id (
          id,
          name,
          code
        )
      `.trim();

    let { data, error } = await supabase
      .from('classes')
      .select(baseSelect)
      .order('semester')
      .order('section');

    // Older databases may not have a department.code column; retry without it
  if (error && /code\s+does\s+not\s+exist/i.test(error.message)) {
      console.warn('Department code column missing; retrying without code field');
      const fallbackSelect = `
        id,
        semester,
        section,
        academic_year,
        department_id,
        department:department_id (
          id,
          name
        )
      `.trim();

      const fallback = await supabase
        .from('classes')
        .select(fallbackSelect)
        .order('semester')
        .order('section');

      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error('Supabase error fetching classes:', error);
      throw error;
    }

    const formatted = (data || []).map((cl) => {
      const deptLabel = cl?.department?.code || cl?.department?.name || 'Department';
      const sectionLabel = cl?.section ? cl.section.toString().trim() : '';
      const classLabel = [deptLabel, sectionLabel].filter(Boolean).join(' ');

      return {
        ...cl,
        departments: cl.department,
        display_name: `${classLabel} - Semester ${cl.semester}`,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes', details: error.message });
  }
});

export default router;

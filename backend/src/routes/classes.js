import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const baseQuerySelect = `
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

    let { data: classList, error: queryError } = await supabase
      .from('classes')
      .select(baseQuerySelect)
      .order('semester')
      .order('section');

    const isDepartmentCodeMissingError = queryError && /code\s+does\s+not\s+exist/i.test(queryError.message);
    
    if (isDepartmentCodeMissingError) {
      console.warn('Department code column missing; retrying without code field');
      const fallbackQuerySelect = `
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

      const fallbackQuery = await supabase
        .from('classes')
        .select(fallbackQuerySelect)
        .order('semester')
        .order('section');

      classList = fallbackQuery.data;
      queryError = fallbackQuery.error;
    }

    if (queryError) {
      console.error('Supabase error fetching classes:', queryError);
      throw new Error(`Failed to query classes: ${queryError.message}`);
    }

    const formattedClassList = (classList || []).map((classItem) => {
      const departmentLabel = classItem?.department?.code || classItem?.department?.name || 'Department';
      const sectionLabel = classItem?.section ? classItem.section.toString().trim() : '';
      const classIdentifier = [departmentLabel, sectionLabel].filter(Boolean).join(' ');

      return {
        ...classItem,
        departments: classItem.department,
        display_name: `${classIdentifier} - Semester ${classItem.semester}`,
      };
    });

    res.json(formattedClassList);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch classes', 
      details: error.message 
    });
  }
});

export default router;

import { supabase } from '../config/database.js';

const facultyController = {
  // Get all faculty
  getAll: async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT f.*, d.name as department_name 
         FROM faculty f 
         LEFT JOIN departments d ON f.department_id = d.id`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get faculty by ID
  getById: async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT f.*, d.name as department_name 
         FROM faculty f 
         LEFT JOIN departments d ON f.department_id = d.id 
         WHERE f.id = $1`,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new faculty
  create: async (req, res) => {
    try {
      const { name, email, password, department_id, role, designation, expertise, preferences } = req.body;
      
      // Check if email already exists
      const { rows: existingUser } = await db.query(
        'SELECT id FROM faculty WHERE email = $1',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const { rows } = await db.query(
        `INSERT INTO faculty 
         (name, email, password, department_id, role, designation, expertise, preferences) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [name, email, password, department_id, role || 'faculty', designation, expertise, preferences]
      );

      res.status(201).json(rows[0]);
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
        const { rows: existingUser } = await db.query(
          'SELECT id FROM faculty WHERE email = $1 AND id != $2',
          [email, req.params.id]
        );

        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }

      const { rows } = await db.query(
        `UPDATE faculty 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             password = COALESCE($3, password),
             department_id = COALESCE($4, department_id),
             role = COALESCE($5, role),
             designation = COALESCE($6, designation),
             expertise = COALESCE($7, expertise),
             preferences = COALESCE($8, preferences)
         WHERE id = $9 
         RETURNING *`,
        [name, email, password, department_id, role, designation, expertise, preferences, req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete faculty
  delete: async (req, res) => {
    try {
      const { rows } = await db.query(
        'DELETE FROM faculty WHERE id = $1 RETURNING id',
        [req.params.id]
      );

      if (rows.length === 0) {
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
      const { rows } = await db.query(
        `SELECT f.id, f.name, f.designation,
                COUNT(DISTINCT a.id) as total_courses,
                SUM(c.credits) as total_credits
         FROM faculty f
         LEFT JOIN allocations a ON f.id = a.faculty_id
         LEFT JOIN courses c ON a.course_id = c.id
         WHERE f.id = $1
         GROUP BY f.id, f.name, f.designation`,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default facultyController;
import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/database.js';

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get faculty details with department name
      const { rows } = await db.query(
        `SELECT f.*, d.name as department_name 
         FROM faculty f 
         LEFT JOIN departments d ON f.department_id = d.id
         WHERE f.email = $1 AND f.password = $2`,
        [email, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const faculty = rows[0];
      
      const token = jwt.sign(
        { 
          userId: faculty.id,
          email: faculty.email,
          role: faculty.role,
          department: faculty.department_id
        },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: faculty.id,
          email: faculty.email,
          role: faculty.role,
          department: faculty.department_id,
          departmentName: faculty.department_name,
          name: faculty.name
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  register: async (req, res) => {
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

      // Insert new faculty
      const { rows } = await db.query(
        `INSERT INTO faculty 
         (name, email, password, department_id, role, designation, expertise, preferences) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, email, password, department_id, role || 'faculty', designation, expertise, preferences]
      );

      const faculty = rows[0];
      
      const token = jwt.sign(
        { 
          userId: faculty.id,
          email: faculty.email,
          role: faculty.role,
          department: faculty.department_id
        },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: faculty.id,
          email: faculty.email,
          role: faculty.role,
          department: faculty.department_id,
          name: faculty.name
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  profile: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const { rows } = await db.query(
        `SELECT f.*, d.name as department_name 
         FROM faculty f 
         LEFT JOIN departments d ON f.department_id = d.id
         WHERE f.id = $1`,
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const faculty = rows[0];

      res.json({
        id: faculty.id,
        email: faculty.email,
        role: faculty.role,
        department: faculty.department_id,
        departmentName: faculty.department_name,
        name: faculty.name,
        designation: faculty.designation,
        expertise: faculty.expertise,
        preferences: faculty.preferences
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default authController;
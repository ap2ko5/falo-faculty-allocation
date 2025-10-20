import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/database.js';

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get faculty details with department name
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !faculty) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
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
          departmentName: faculty.departments?.name,
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
      const { data: existingUser, error: checkError } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Insert new faculty
      const { data: faculty, error: insertError } = await supabase
        .from('faculty')
        .insert([{
          name,
          email,
          password,
          department_id,
          role: role || 'faculty',
          designation,
          expertise,
          preferences
        }])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
      
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
      
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error || !faculty) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: faculty.id,
        email: faculty.email,
        role: faculty.role,
        department: faculty.department_id,
        departmentName: faculty.departments?.name,
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
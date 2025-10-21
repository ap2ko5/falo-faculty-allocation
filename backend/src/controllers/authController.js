import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/database.js';

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Get faculty details with department name (username maps to email in DB)
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          id,
          email,
          password,
          role,
          name,
          department_id,
          designation,
          expertise,
          preferences,
          departments (
            name
          )
        `)
        .eq('email', username)
        .maybeSingle();

      if (error) throw error;
      
      if (!faculty) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare hashed password
      const match = await bcrypt.compare(password, faculty.password);
      if (!match) {
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
      const { username, password, role, name, department_id, designation, expertise, preferences } = req.body;
      
      // Check if username already exists (username maps to email column)
      const { data: existingUser, error: checkError } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', username)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingUser) {
        return res.status(400).json({ error: 'Username already registered' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new faculty (username goes into email column)
      const { data: faculty, error } = await supabase
        .from('faculty')
        .insert([{
          email: username,
          password: hashedPassword,
          role: role || 'faculty',
          name: name || username,
          department_id: department_id || 1,
          designation,
          expertise,
          preferences
        }])
        .select()
        .single();

      if (error) throw error;
      
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
          id,
          email,
          role,
          name,
          department_id,
          designation,
          expertise,
          preferences,
          departments (
            name
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!faculty) {
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
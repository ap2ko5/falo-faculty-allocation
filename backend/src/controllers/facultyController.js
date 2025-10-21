import { supabase } from '../config/database.js';
import bcrypt from 'bcrypt';

const facultyController = {
  // Get all faculty
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select(`
          id,
          name,
          email,
          role,
          designation,
          expertise,
          preferences,
          department_id,
          departments (
            name
          )
        `);
      
      if (error) throw error;
      
      const formatted = data.map(f => ({
        ...f,
        department_name: f.departments?.name
      }));
      
      res.json(formatted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get faculty by ID
  getById: async (req, res) => {
    try {
      const { data: faculty, error } = await supabase
        .from('faculty')
        .select(`
          id,
          name,
          email,
          role,
          designation,
          expertise,
          preferences,
          department_id,
          departments (
            name
          )
        `)
        .eq('id', req.params.id)
        .maybeSingle();

      if (error) throw error;

      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json({
        ...faculty,
        department_name: faculty.departments?.name
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new faculty
  create: async (req, res) => {
    try {
      const { username, password, name, department_id, role, designation, expertise, preferences } = req.body;
      
      // Check if username already exists (stored in email column)
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

      const { data, error } = await supabase
        .from('faculty')
        .insert([{
          email: username,
          password: hashedPassword,
          name: name || username,
          department_id,
          role: role || 'faculty',
          designation,
          expertise,
          preferences
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update faculty
  update: async (req, res) => {
    try {
      const { username, password, name, department_id, role, designation, expertise, preferences } = req.body;

      // Check if updating username to one that already exists (stored in email column)
      if (username) {
        const { data: existingUser, error: checkError } = await supabase
          .from('faculty')
          .select('id')
          .eq('email', username)
          .neq('id', req.params.id)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existingUser) {
          return res.status(400).json({ error: 'Username already in use' });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (username !== undefined) updateData.email = username;
      if (department_id !== undefined) updateData.department_id = department_id;
      if (role !== undefined) updateData.role = role;
      if (designation !== undefined) updateData.designation = designation;
      if (expertise !== undefined) updateData.expertise = expertise;
      if (preferences !== undefined) updateData.preferences = preferences;
      
      // Hash password if provided
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      const { data, error } = await supabase
        .from('faculty')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete faculty
  delete: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', req.params.id)
        .select('id')
        .single();

      if (error) throw error;

      if (!data) {
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
      // Get faculty details
      const { data: faculty, error: facultyError } = await supabase
        .from('faculty')
        .select('id, name, designation')
        .eq('id', req.params.id)
        .maybeSingle();

      if (facultyError) throw facultyError;

      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }

      // Get allocations for this faculty
      const { data: allocations, error: allocError } = await supabase
        .from('allocations')
        .select(`
          id,
          courses (
            credits
          )
        `)
        .eq('faculty_id', req.params.id);

      if (allocError) throw allocError;

      const total_courses = allocations.length;
      const total_credits = allocations.reduce((sum, a) => sum + (a.courses?.credits || 0), 0);

      res.json({
        id: faculty.id,
        name: faculty.name,
        designation: faculty.designation,
        total_courses,
        total_credits
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default facultyController;
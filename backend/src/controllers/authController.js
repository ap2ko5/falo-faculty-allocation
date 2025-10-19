import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/database.js';

export const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      const token = jwt.sign(
        { userId: data.user.id, email: data.user.email },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({ token, user: data.user });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      });
      
      if (error) throw error;
      res.json({ message: 'Registration successful', user: data.user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  verify: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};
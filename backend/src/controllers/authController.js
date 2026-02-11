import { supabase } from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/database.js';

const AUTH_CONFIG = {
  PASSWORD_SALT_ROUNDS: 10,
  TOKEN_EXPIRY: '24h',
  DEFAULT_DEPARTMENT_ID: 1,
  DEFAULT_ROLE: 'faculty'
};

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const { data: userAccount, error } = await supabase
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

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }
      
      const userExists = userAccount !== null;
      
      if (!userExists) {
        return res.status(401).json({ 
          error: 'Login failed',
          details: 'Username or password is incorrect',
          hint: 'Please check your credentials and try again'
        });
      }

      const passwordMatches = await bcrypt.compare(password, userAccount.password);
      
      if (!passwordMatches) {
        return res.status(401).json({ 
          error: 'Login failed',
          details: 'Username or password is incorrect',
          hint: 'Please check your credentials and try again'
        });
      }
      
      const authToken = jwt.sign(
        { 
          userId: userAccount.id,
          email: userAccount.email,
          role: userAccount.role,
          department: userAccount.department_id
        },
        config.jwtSecret,
        { expiresIn: AUTH_CONFIG.TOKEN_EXPIRY }
      );

      return res.json({
        token: authToken,
        user: {
          id: userAccount.id,
          email: userAccount.email,
          role: userAccount.role,
          department: userAccount.department_id,
          departmentName: userAccount.departments?.name,
          name: userAccount.name
        }
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Login error',
        details: err.message 
      });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, role, name, department_id, designation, expertise, preferences } = req.body;
      
      const { data: existingUser, error: checkError } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', username)
        .maybeSingle();

      const isNotFoundError = checkError?.code === 'PGRST116';
      
      if (checkError && !isNotFoundError) {
        throw new Error(`Failed to check existing user: ${checkError.message}`);
      }

      const usernameAlreadyTaken = existingUser !== null;
      
      if (usernameAlreadyTaken) {
        return res.status(400).json({ 
          error: 'Username unavailable',
          details: 'This username is already registered',
          hint: 'Please choose a different username or try logging in'
        });
      }

      const hashedPassword = await bcrypt.hash(password, AUTH_CONFIG.PASSWORD_SALT_ROUNDS);

      const newUserData = {
        email: username,
        password: hashedPassword,
        role: role || AUTH_CONFIG.DEFAULT_ROLE,
        name: name || username,
        department_id: department_id || AUTH_CONFIG.DEFAULT_DEPARTMENT_ID,
        designation,
        expertise,
        preferences
      };

      const { data: createdUser, error: insertError } = await supabase
        .from('faculty')
        .insert([newUserData])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create user account: ${insertError.message}`);
      }
      
      const authToken = jwt.sign(
        { 
          userId: createdUser.id,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department_id
        },
        config.jwtSecret,
        { expiresIn: AUTH_CONFIG.TOKEN_EXPIRY }
      );

      res.json({
        token: authToken,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department_id,
          name: createdUser.name
        }
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Registration failed',
        details: err.message 
      });
    }
  },

  profile: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const { data: userProfile, error } = await supabase
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

      if (error) {
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      const profileNotFound = userProfile === null;
      
      if (profileNotFound) {
        return res.status(404).json({ 
          error: 'Profile not found',
          details: 'Your user account could not be located',
          hint: 'Please try logging in again'
        });
      }

      res.json({
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
        department: userProfile.department_id,
        departmentName: userProfile.departments?.name,
        name: userProfile.name,
        designation: userProfile.designation,
        expertise: userProfile.expertise,
        preferences: userProfile.preferences
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to load profile',
        details: err.message 
      });
    }
  }
};

export default authController;
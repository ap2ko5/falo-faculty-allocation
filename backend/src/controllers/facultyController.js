import { supabase } from '../config/database.js';
import bcrypt from 'bcrypt';

const FACULTY_CONFIG = {
  PASSWORD_SALT_ROUNDS: 10,
  DEFAULT_ROLE: 'faculty'
};

const facultyController = {
  getAll: async (req, res) => {
    try {
      const { data: allFaculty, error } = await supabase
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
      
      if (error) {
        throw new Error(`Failed to fetch faculty: ${error.message}`);
      }
      
      const formattedFacultyList = allFaculty.map(facultyMember => ({
        ...facultyMember,
        department_name: facultyMember.departments?.name
      }));
      
      res.json(formattedFacultyList);
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to retrieve faculty members',
        details: err.message 
      });
    }
  },

  getById: async (req, res) => {
    try {
      const facultyId = req.params.id;
      
      const { data: facultyMember, error } = await supabase
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
        .eq('id', facultyId)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch faculty member: ${error.message}`);
      }

      const facultyNotFound = facultyMember === null;
      
      if (facultyNotFound) {
        return res.status(404).json({ 
          error: 'Faculty member not found',
          details: `No faculty member exists with ID ${facultyId}`,
          hint: 'Please verify the faculty ID and try again'
        });
      }

      res.json({
        ...facultyMember,
        department_name: facultyMember.departments?.name
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to retrieve faculty member',
        details: err.message 
      });
    }
  },

  create: async (req, res) => {
    try {
      const { username, password, name, department_id, role, designation, expertise, preferences } = req.body;
      
      const { data: existingUser, error: checkError } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', username)
        .maybeSingle();

      const isNotFoundError = checkError?.code === 'PGRST116';
      
      if (checkError && !isNotFoundError) {
        throw new Error(`Failed to check existing faculty: ${checkError.message}`);
      }

      const usernameAlreadyTaken = existingUser !== null;
      
      if (usernameAlreadyTaken) {
        return res.status(400).json({ 
          error: 'Username unavailable',
          details: 'This username is already registered',
          hint: 'Please choose a different username'
        });
      }

      const hashedPassword = await bcrypt.hash(password, FACULTY_CONFIG.PASSWORD_SALT_ROUNDS);

      const newFacultyData = {
        email: username,
        password: hashedPassword,
        name: name || username,
        department_id,
        role: role || FACULTY_CONFIG.DEFAULT_ROLE,
        designation,
        expertise,
        preferences
      };

      const { data: createdFaculty, error: insertError } = await supabase
        .from('faculty')
        .insert([newFacultyData])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create faculty member: ${insertError.message}`);
      }

      res.status(201).json(createdFaculty);
    } catch (err) {
      res.status(500).json({ 
        error: 'Faculty creation failed',
        details: err.message 
      });
    }
  },

  update: async (req, res) => {
    try {
      const facultyId = req.params.id;
      const { username, password, name, department_id, role, designation, expertise, preferences } = req.body;

      const isUpdatingUsername = username !== undefined;
      
      if (isUpdatingUsername) {
        const { data: existingUser, error: checkError } = await supabase
          .from('faculty')
          .select('id')
          .eq('email', username)
          .neq('id', facultyId)
          .maybeSingle();

        const isNotFoundError = checkError?.code === 'PGRST116';
        
        if (checkError && !isNotFoundError) {
          throw new Error(`Failed to check username availability: ${checkError.message}`);
        }

        const usernameInUse = existingUser !== null;
        
        if (usernameInUse) {
          return res.status(400).json({ 
            error: 'Username unavailable',
            details: 'This username is already taken by another faculty member',
            hint: 'Please choose a different username'
          });
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
      
      const isUpdatingPassword = password !== undefined && password !== '';
      
      if (isUpdatingPassword) {
        updateData.password = await bcrypt.hash(password, FACULTY_CONFIG.PASSWORD_SALT_ROUNDS);
      }

      const { data: updatedFaculty, error: updateError } = await supabase
        .from('faculty')
        .update(updateData)
        .eq('id', facultyId)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update faculty member: ${updateError.message}`);
      }

      const facultyNotFound = updatedFaculty === null;
      
      if (facultyNotFound) {
        return res.status(404).json({ 
          error: 'Faculty member not found',
          details: `No faculty member exists with ID ${facultyId}`,
          hint: 'Please verify the faculty ID and try again'
        });
      }

      res.json(updatedFaculty);
    } catch (err) {
      res.status(500).json({ 
        error: 'Faculty update failed',
        details: err.message 
      });
    }
  },

  delete: async (req, res) => {
    try {
      const facultyId = req.params.id;
      
      const { data: deletedFaculty, error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', facultyId)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to delete faculty member: ${error.message}`);
      }

      const facultyNotFound = deletedFaculty === null;
      
      if (facultyNotFound) {
        return res.status(404).json({ 
          error: 'Faculty member not found',
          details: `No faculty member exists with ID ${facultyId}`,
          hint: 'The faculty member may have already been deleted'
        });
      }

      res.json({ 
        message: 'Faculty member deleted successfully',
        deletedId: deletedFaculty.id
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Faculty deletion failed',
        details: err.message 
      });
    }
  },

  getWorkload: async (req, res) => {
    try {
      const facultyId = req.params.id;
      
      const { data: facultyMember, error: facultyError } = await supabase
        .from('faculty')
        .select('id, name, designation')
        .eq('id', facultyId)
        .maybeSingle();

      if (facultyError) {
        throw new Error(`Failed to fetch faculty member: ${facultyError.message}`);
      }

      const facultyNotFound = facultyMember === null;
      
      if (facultyNotFound) {
        return res.status(404).json({ 
          error: 'Faculty member not found',
          details: `No faculty member exists with ID ${facultyId}`,
          hint: 'Please verify the faculty ID and try again'
        });
      }

      const { data: courseAllocations, error: allocError } = await supabase
        .from('allocations')
        .select(`
          id,
          courses (
            credits
          )
        `)
        .eq('faculty_id', facultyId);

      if (allocError) {
        throw new Error(`Failed to fetch course allocations: ${allocError.message}`);
      }

      const totalAssignedCourses = courseAllocations.length;
      const totalCreditHours = courseAllocations.reduce(
        (accumulatedCredits, allocation) => accumulatedCredits + (allocation.courses?.credits || 0), 
        0
      );

      res.json({
        id: facultyMember.id,
        name: facultyMember.name,
        designation: facultyMember.designation,
        total_courses: totalAssignedCourses,
        total_credits: totalCreditHours
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to calculate faculty workload',
        details: err.message 
      });
    }
  }
};

export default facultyController;
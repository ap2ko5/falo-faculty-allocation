import { supabase } from '../config/database.js';

const allocationController = {
  getAll: async (req, res) => {
    try {
      // Fetch all data in parallel
      const [allocationsResult, facultyResult, coursesResult, classesResult] = await Promise.all([
        supabase.from('allocations').select('*').order('created_at', { ascending: false }),
        supabase.from('faculty').select('id, name, email, department_id'),
        supabase.from('courses').select('id, name, code, credits, semester'),
        supabase.from('classes').select('id, name, section, semester, department_id')
      ]);

      // Check for errors
      if (allocationsResult.error) {
        console.error('Error fetching allocations:', allocationsResult.error);
        throw allocationsResult.error;
      }
      if (facultyResult.error) console.error('Error fetching faculty:', facultyResult.error);
      if (coursesResult.error) console.error('Error fetching courses:', coursesResult.error);
      if (classesResult.error) console.error('Error fetching classes:', classesResult.error);

      // Create lookup maps for efficient joining
      const facultyMap = new Map((facultyResult.data || []).map(f => [f.id, f]));
      const courseMap = new Map((coursesResult.data || []).map(c => [c.id, c]));
      const classMap = new Map((classesResult.data || []).map(cl => [cl.id, cl]));

      // Join data manually
      const enrichedAllocations = (allocationsResult.data || []).map(allocation => ({
        ...allocation,
        faculty: facultyMap.get(allocation.faculty_id) || null,
        course: courseMap.get(allocation.course_id) || null,
        class: classMap.get(allocation.class_id) || null
      }));

      console.log(`Returning ${enrichedAllocations.length} allocations with joined data`);
      res.json(enrichedAllocations);
    } catch (err) {
      console.error('Error in getAll allocations:', err);
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { faculty_id, class_id, course_id, academic_year, semester, status } = req.body;
      
      const { data, error } = await supabase
        .from('allocations')
        .insert([{ 
          faculty_id, 
          class_id, 
          course_id, 
          academic_year, 
          semester,
          status: status || 'approved' // Default to approved if not specified
        }])
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  approve: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .update({ status: 'approved' })
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  reject: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .update({ status: 'rejected' })
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = await supabase
        .from('allocations')
        .delete()
        .eq('id', req.params.id);
      
      if (error) throw error;
      res.json({ message: 'Allocation deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  autoAllocate: async (req, res) => {
    try {
      // TODO: Implement auto-allocation logic
      res.json({ message: 'Auto-allocation not implemented yet' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getWindows: async (req, res) => {
    try {
      // Since we don't have a separate AllocationWindow table in PostgreSQL
      // we can modify this to return the current academic year and semester
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const semester = currentMonth >= 6 ? 2 : 1; // Second semester starts in July

      res.json([{
        academic_year: currentYear,
        semester: semester,
        status: 'active'
      }]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default allocationController;
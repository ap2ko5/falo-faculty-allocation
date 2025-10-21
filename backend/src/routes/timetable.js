import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get timetable for a specific class
router.get('/class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        allocation:allocations!inner(
          id,
          faculty:faculty!inner(id, name, email),
          course:courses!inner(id, code, name, credits),
          class:classes!inner(id, section, semester)
        )
      `)
      .eq('allocation.class_id', classId)
      .order('day_of_week')
      .order('time_slot');

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error fetching class timetable:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get timetable for a specific faculty
router.get('/faculty/:facultyId', async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        allocation:allocations!inner(
          id,
          faculty:faculty!inner(id, name, email),
          course:courses!inner(id, code, name, credits),
          class:classes!inner(id, section, semester)
        )
      `)
      .eq('allocation.faculty_id', facultyId)
      .order('day_of_week')
      .order('time_slot');

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error fetching faculty timetable:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all timetable entries
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        allocation:allocations(
          id,
          academic_year,
          semester,
          faculty:faculty(id, name, email),
          course:courses(id, code, name, credits),
          class:classes(id, section, semester, department_id)
        )
      `)
      .order('day_of_week')
      .order('time_slot');

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get timetable statistics
router.get('/stats', async (req, res) => {
  try {
    const [timetableCount, slotUtilization] = await Promise.all([
      supabase.from('timetable').select('id', { count: 'exact', head: true }),
      supabase.from('timetable').select('day_of_week, time_slot')
    ]);

    const totalSlots = 5 * 8; // 5 days * 8 slots
    const usedSlots = new Set();
    
    if (slotUtilization.data) {
      slotUtilization.data.forEach(entry => {
        usedSlots.add(`${entry.day_of_week}-${entry.time_slot}`);
      });
    }

    res.json({
      total_entries: timetableCount.count || 0,
      total_possible_slots: totalSlots,
      unique_slots_used: usedSlots.size,
      utilization_percentage: ((usedSlots.size / totalSlots) * 100).toFixed(2)
    });
  } catch (err) {
    console.error('Error fetching timetable stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate timetables for all allocations (admin only)
router.post('/generate', async (req, res) => {
  try {
    const { academic_year, semester } = req.body;

    if (!academic_year || !semester) {
      return res.status(400).json({ error: 'Academic year and semester are required' });
    }

    // Fetch allocations for the specified academic year and semester
    const { data: allocations, error: allocError } = await supabase
      .from('allocations')
      .select(`
        *,
        faculty:faculty!inner(id, name, role),
        class:classes!inner(id, section, semester, department_id)
      `)
      .eq('academic_year', academic_year)
      .eq('semester', semester)
      .eq('status', 'approved');

    if (allocError) throw allocError;

    // Filter only faculty members (exclude admins)
    const facultyAllocations = (allocations || []).filter(a => a.faculty?.role === 'faculty');

    if (facultyAllocations.length === 0) {
      return res.json({
        message: 'No approved faculty allocations found for this period',
        timetable_entries_created: 0
      });
    }

    // Delete existing timetable entries for this period to avoid duplicates
    const allocationIds = facultyAllocations.map(a => a.id);
    await supabase
      .from('timetable')
      .delete()
      .in('allocation_id', allocationIds);

    // Generate timetable entries
    const timetableEntries = [];
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const SLOTS = 8; // 9 AM to 5 PM

    const occupiedSlots = new Set(); // Track occupied slots: "faculty_id-day-slot" or "class_id-day-slot"

    for (const allocation of facultyAllocations) {
      let assigned = false;
      
      // Try to find an available slot
      for (let day = 0; day < DAYS.length && !assigned; day++) {
        for (let slot = 0; slot < SLOTS && !assigned; slot++) {
          const facultyKey = `${allocation.faculty_id}-${day}-${slot}`;
          const classKey = `${allocation.class_id}-${day}-${slot}`;
          
          // Check if both faculty and class are free at this slot
          if (!occupiedSlots.has(facultyKey) && !occupiedSlots.has(classKey)) {
            // Assign this slot
            timetableEntries.push({
              allocation_id: allocation.id,
              day_of_week: day,
              time_slot: slot,
              room_number: `D${allocation.class.department_id}${Math.floor(Math.random() * 100) + 101}` // Room naming
            });
            
            // Mark slots as occupied
            occupiedSlots.add(facultyKey);
            occupiedSlots.add(classKey);
            assigned = true;
          }
        }
      }

      if (!assigned) {
        console.warn(`Could not find slot for allocation ${allocation.id}`);
      }
    }

    // Insert timetable entries
    if (timetableEntries.length > 0) {
      const { data: insertedTimetable, error: insertError } = await supabase
        .from('timetable')
        .insert(timetableEntries)
        .select();

      if (insertError) throw insertError;

      res.json({
        message: 'Timetables generated successfully',
        timetable_entries_created: insertedTimetable.length,
        allocations_processed: facultyAllocations.length
      });
    } else {
      res.json({
        message: 'No timetable entries could be generated',
        timetable_entries_created: 0
      });
    }
  } catch (err) {
    console.error('Error generating timetables:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

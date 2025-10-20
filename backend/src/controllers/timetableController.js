import { supabase } from '../config/database.js';

const timetableController = {
  getAll: async (req, res) => {
    try {
      const { data: timetable, error } = await supabase
        .from('timetable')
        .select(`
          *,
          allocations (
            faculty: faculty_id (
              name
            ),
            class: class_id (
              section,
              semester
            ),
            course: course_id (
              code,
              name
            )
          )
        `);

      if (error) {
        throw error;
      }

      const formattedTimetable = timetable.map(entry => ({
        ...entry,
        faculty_name: entry.allocations?.faculty?.name,
        section: entry.allocations?.class?.section,
        class_semester: entry.allocations?.class?.semester,
        course_code: entry.allocations?.course?.code,
        course_name: entry.allocations?.course?.name
      }));

      res.json(formattedTimetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByClass: async (req, res) => {
    try {
      const { data: timetable, error } = await supabase
        .from('timetable')
        .select(`
          *,
          allocations (
            faculty: faculty_id (
              name
            ),
            class: class_id (
              section,
              semester
            ),
            course: course_id (
              code,
              name
            )
          )
        `)
        .eq('allocations.class_id', req.params.class_id);

      if (error) {
        throw error;
      }

      const formattedTimetable = timetable.map(entry => ({
        ...entry,
        faculty_name: entry.allocations?.faculty?.name,
        section: entry.allocations?.class?.section,
        class_semester: entry.allocations?.class?.semester,
        course_code: entry.allocations?.course?.code,
        course_name: entry.allocations?.course?.name
      }));

      res.json(formattedTimetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByFaculty: async (req, res) => {
    try {
      const { data: timetable, error } = await supabase
        .from('timetable')
        .select(`
          *,
          allocations (
            faculty: faculty_id (
              name
            ),
            class: class_id (
              section,
              semester
            ),
            course: course_id (
              code,
              name
            )
          )
        `)
        .eq('allocations.faculty_id', req.params.faculty_id);

      if (error) {
        throw error;
      }

      const formattedTimetable = timetable.map(entry => ({
        ...entry,
        faculty_name: entry.allocations?.faculty?.name,
        section: entry.allocations?.class?.section,
        class_semester: entry.allocations?.class?.semester,
        course_code: entry.allocations?.course?.code,
        course_name: entry.allocations?.course?.name
      }));

      res.json(formattedTimetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { allocation_id, day_of_week, time_slot, room_number } = req.body;

      // First get the faculty_id for the allocation
      const { data: allocation, error: allocationError } = await supabase
        .from('allocations')
        .select('faculty_id')
        .eq('id', allocation_id)
        .single();

      if (allocationError) {
        throw allocationError;
      }

      // Check for conflicts
      const { data: conflicts, error: conflictsError } = await supabase
        .from('timetable')
        .select(`
          *,
          allocations!inner (
            faculty_id
          )
        `)
        .eq('day_of_week', day_of_week)
        .eq('time_slot', time_slot)
        .or(`room_number.eq.${room_number},allocations.faculty_id.eq.${allocation.faculty_id}`);

      if (conflictsError) {
        throw conflictsError;
      }

      if (conflicts.length > 0) {
        return res.status(400).json({ error: 'Time slot conflict detected' });
      }

      // Create new timetable entry
      const { data: newEntry, error: insertError } = await supabase
        .from('timetable')
        .insert([{
          allocation_id,
          day_of_week,
          time_slot,
          room_number
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  generate: async (req, res) => {
    try {
      // TODO: Implement timetable generation logic
      res.json({ message: 'Timetable generation not implemented yet' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Timetable entry not found' });
      }

      res.json({ message: 'Timetable entry deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default timetableController;
import { supabase } from '../config/database.js';

const timetableController = {
  getAll: async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT t.*, 
                f.name as faculty_name,
                cl.section,
                cl.semester as class_semester,
                c.code as course_code,
                c.name as course_name
         FROM timetable t
         JOIN allocations a ON t.allocation_id = a.id
         JOIN faculty f ON a.faculty_id = f.id
         JOIN classes cl ON a.class_id = cl.id
         JOIN courses c ON a.course_id = c.id`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByClass: async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT t.*, 
                f.name as faculty_name,
                cl.section,
                cl.semester as class_semester,
                c.code as course_code,
                c.name as course_name
         FROM timetable t
         JOIN allocations a ON t.allocation_id = a.id
         JOIN faculty f ON a.faculty_id = f.id
         JOIN classes cl ON a.class_id = cl.id
         JOIN courses c ON a.course_id = c.id
         WHERE cl.id = $1`,
        [req.params.class_id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getByFaculty: async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT t.*, 
                f.name as faculty_name,
                cl.section,
                cl.semester as class_semester,
                c.code as course_code,
                c.name as course_name
         FROM timetable t
         JOIN allocations a ON t.allocation_id = a.id
         JOIN faculty f ON a.faculty_id = f.id
         JOIN classes cl ON a.class_id = cl.id
         JOIN courses c ON a.course_id = c.id
         WHERE f.id = $1`,
        [req.params.faculty_id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { allocation_id, day_of_week, time_slot, room_number } = req.body;

      // Check for conflicts
      const { rows: conflicts } = await db.query(
        `SELECT t.* 
         FROM timetable t 
         WHERE t.day_of_week = $1 
           AND t.time_slot = $2
           AND (t.room_number = $3 
                OR t.allocation_id IN (
                    SELECT id FROM allocations 
                    WHERE faculty_id = (
                        SELECT faculty_id FROM allocations WHERE id = $4
                    )
                ))`,
        [day_of_week, time_slot, room_number, allocation_id]
      );

      if (conflicts.length > 0) {
        return res.status(400).json({ error: 'Time slot conflict detected' });
      }

      // Create new timetable entry
      const { rows } = await db.query(
        `INSERT INTO timetable 
         (allocation_id, day_of_week, time_slot, room_number) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [allocation_id, day_of_week, time_slot, room_number]
      );

      res.status(201).json(rows[0]);
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
      const { rows } = await db.query(
        'DELETE FROM timetable WHERE id = $1 RETURNING id',
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Timetable entry not found' });
      }

      res.json({ message: 'Timetable entry deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default timetableController;
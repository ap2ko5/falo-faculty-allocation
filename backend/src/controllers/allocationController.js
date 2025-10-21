import { supabase } from '../config/database.js';

/**
 * Generate timetable entries for allocations
 * Distributes classes across Monday-Friday, 8 time slots per day
 * Avoids conflicts: same faculty/class can't be in multiple places at once
 */
async function generateTimetable(allocations, classes) {
  const timetableEntries = [];
  
  // Track occupied slots: key = "faculty_id-day-slot" or "class_id-day-slot"
  const facultySlots = new Set();
  const classSlots = new Set();
  const roomCounter = {}; // Track room assignments per day/slot
  
  // Time slots: 1-8 (e.g., 9:00 AM - 4:00 PM with 1-hour slots)
  const TIME_SLOTS = 8;
  const DAYS = 5; // Monday to Friday
  
  // Helper to find next available slot for a faculty-class pair
  const findAvailableSlot = (facultyId, classId) => {
    for (let day = 1; day <= DAYS; day++) {
      for (let slot = 1; slot <= TIME_SLOTS; slot++) {
        const facultyKey = `${facultyId}-${day}-${slot}`;
        const classKey = `${classId}-${day}-${slot}`;
        
        // Check if both faculty and class are free at this slot
        if (!facultySlots.has(facultyKey) && !classSlots.has(classKey)) {
          return { day, slot };
        }
      }
    }
    return null; // No slot available (overbooked)
  };
  
  // Helper to generate room number
  const getRoomNumber = (day, slot, classId) => {
    const key = `${day}-${slot}`;
    if (!roomCounter[key]) roomCounter[key] = 0;
    roomCounter[key]++;
    
    // Use class department info if available
    const cls = classes.find(c => c.id === classId);
    const prefix = cls?.department_id ? `D${cls.department_id}` : 'R';
    return `${prefix}${100 + roomCounter[key]}`;
  };
  
  // Process each allocation
  for (const allocation of allocations) {
    const slot = findAvailableSlot(allocation.faculty_id, allocation.class_id);
    
    if (slot) {
      const { day, slot: timeSlot } = slot;
      const roomNumber = getRoomNumber(day, timeSlot, allocation.class_id);
      
      timetableEntries.push({
        allocation_id: allocation.id,
        day_of_week: day,
        time_slot: timeSlot,
        room_number: roomNumber
      });
      
      // Mark slots as occupied
      facultySlots.add(`${allocation.faculty_id}-${day}-${timeSlot}`);
      classSlots.add(`${allocation.class_id}-${day}-${timeSlot}`);
    } else {
      console.warn(`Warning: Could not find available slot for allocation ${allocation.id}`);
    }
  }
  
  return timetableEntries;
}

const allocationController = {
  getAll: async (req, res) => {
    try {
      // Fetch all data in parallel
      const fetchClasses = async () => {
        const result = { data: null, error: null, warnings: [] };
        const options = {
          includeName: true,
          includeAcademicYear: true,
          includeDeptCode: true,
        };

        const buildSelect = () => {
          const fields = [
            'id',
            options.includeName ? 'name' : null,
            'section',
            'semester',
            options.includeAcademicYear ? 'academic_year' : null,
            'department_id',
            `department:department_id (
              id,
              name${options.includeDeptCode ? ',\n              code' : ''}
            )`,
          ].filter(Boolean);

          return `
            ${fields.join(',\n            ')}
          `;
        };

        for (let attempt = 0; attempt < 5; attempt += 1) {
          const { data, error } = await supabase
            .from('classes')
            .select(buildSelect())
            .order('semester')
            .order('section');

          if (!error) {
            result.data = data;
            return result;
          }

          const message = (error.message || '').toLowerCase();

          if (options.includeDeptCode && message.includes('code') && message.includes('does not exist')) {
            options.includeDeptCode = false;
            result.warnings.push('classes.department.code missing; retrying without code');
            continue;
          }

          if (options.includeName && message.includes('name') && message.includes('does not exist')) {
            options.includeName = false;
            result.warnings.push('classes.name missing; retrying without name');
            continue;
          }

          if (options.includeAcademicYear && message.includes('academic_year') && message.includes('does not exist')) {
            options.includeAcademicYear = false;
            result.warnings.push('classes.academic_year missing; retrying without academic_year');
            continue;
          }

          result.error = error;
          return result;
        }

        result.error = new Error('Unable to fetch classes after multiple attempts');
        return result;
      };

      const [allocationsResult, facultyResult, coursesResult, classesResult] = await Promise.all([
        supabase.from('allocations').select('*').order('created_at', { ascending: false }),
        supabase.from('faculty').select('id, name, email, department_id'),
        supabase.from('courses').select('id, name, code, credits, semester'),
        fetchClasses()
      ]);

      if (classesResult.warnings?.length) {
        classesResult.warnings.forEach((warning) => console.warn(warning));
      }

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
      const normalizeClass = (cl) => {
        const department = cl?.department || null;
        const sectionLabel = cl?.section ? cl.section.toString().trim() : '';
        const deptLabel = department?.code || department?.name || '';
        const semesterLabel = cl?.semester ? `Semester ${cl.semester}` : '';
        const compositeLabel = [deptLabel, sectionLabel, semesterLabel].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

        return {
          ...cl,
          department,
          name: cl?.name || compositeLabel || `Class ${cl?.id || ''}`.trim(),
          display_name: compositeLabel || cl?.name || `Class ${cl?.id || ''}`.trim(),
        };
      };

      const classMap = new Map((classesResult.data || []).map(cl => [cl.id, normalizeClass(cl)]));

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
      const { academic_year, semester } = req.body;
      
      if (!academic_year || !semester) {
        return res.status(400).json({ error: 'Academic year and semester are required' });
      }

      console.log(`Starting auto-allocation for ${academic_year} Semester ${semester}`);

      // Step 1: Fetch all required data
      const [facultyResult, coursesResult, classesResult, existingAllocations] = await Promise.all([
        supabase.from('faculty').select('*').eq('role', 'faculty'),
        supabase.from('courses').select('*').eq('semester', semester),
        supabase.from('classes').select('*').eq('semester', semester).eq('academic_year', academic_year),
        supabase.from('allocations').select('*').eq('academic_year', academic_year).eq('semester', semester)
      ]);

      if (facultyResult.error) throw facultyResult.error;
      if (coursesResult.error) throw coursesResult.error;
      if (classesResult.error) throw classesResult.error;

      const faculty = facultyResult.data || [];
      const courses = coursesResult.data || [];
      const classes = classesResult.data || [];
      const existing = existingAllocations.data || [];

      console.log(`Found: ${faculty.length} faculty, ${courses.length} courses, ${classes.length} classes`);
      console.log(`Existing allocations: ${existing.length}`);

      // Step 2: Filter out already allocated combinations
      const allocatedKey = (f, cl, co) => `${f}-${cl}-${co}`;
      const existingKeys = new Set(existing.map(a => allocatedKey(a.faculty_id, a.class_id, a.course_id)));

      // Step 3: Group courses by department
      const coursesByDept = {};
      courses.forEach(course => {
        if (!coursesByDept[course.department_id]) {
          coursesByDept[course.department_id] = [];
        }
        coursesByDept[course.department_id].push(course);
      });

      // Step 4: Group classes by department
      const classesByDept = {};
      classes.forEach(cls => {
        if (!classesByDept[cls.department_id]) {
          classesByDept[cls.department_id] = [];
        }
        classesByDept[cls.department_id].push(cls);
      });

      // Step 5: Group faculty by department
      const facultyByDept = {};
      faculty.forEach(f => {
        if (!facultyByDept[f.department_id]) {
          facultyByDept[f.department_id] = [];
        }
        facultyByDept[f.department_id].push(f);
      });

      // Step 6: Create allocations
      const newAllocations = [];

      // For each department
      Object.keys(coursesByDept).forEach(deptId => {
        const deptCourses = coursesByDept[deptId];
        const deptClasses = classesByDept[deptId] || [];
        const deptFaculty = facultyByDept[deptId] || [];

        if (deptFaculty.length === 0) {
          console.log(`No faculty available for department ${deptId}`);
          return;
        }

        let facultyIndex = 0;

        // For each class in this department
        deptClasses.forEach(cls => {
          // For each course in this department
          deptCourses.forEach(course => {
            // Round-robin faculty assignment
            const assignedFaculty = deptFaculty[facultyIndex % deptFaculty.length];
            facultyIndex++;

            const key = allocatedKey(assignedFaculty.id, cls.id, course.id);
            
            // Skip if already allocated
            if (existingKeys.has(key)) {
              console.log(`Skipping: Faculty ${assignedFaculty.id} already assigned to Class ${cls.id} Course ${course.id}`);
              return;
            }

            // Check expertise match (optional, prioritize but don't require)
            const hasExpertise = !course.required_expertise || 
                                course.required_expertise.length === 0 ||
                                (assignedFaculty.expertise && 
                                 course.required_expertise.some(req => 
                                   assignedFaculty.expertise.some(exp => 
                                     exp.toLowerCase().includes(req.toLowerCase()) ||
                                     req.toLowerCase().includes(exp.toLowerCase())
                                   )
                                 ));

            newAllocations.push({
              faculty_id: assignedFaculty.id,
              class_id: cls.id,
              course_id: course.id,
              academic_year,
              semester,
              status: hasExpertise ? 'approved' : 'pending' // Auto-approve if expertise matches
            });
          });
        });
      });

      console.log(`Created ${newAllocations.length} new allocations`);

      // Step 7: Insert allocations
      if (newAllocations.length > 0) {
        const { data: insertedAllocations, error: insertError } = await supabase
          .from('allocations')
          .insert(newAllocations)
          .select();

        if (insertError) {
          console.error('Error inserting allocations:', insertError);
          throw insertError;
        }

        console.log(`Successfully inserted ${insertedAllocations.length} allocations`);

        // Step 8: Create timetable entries ONLY for faculty allocations (exclude admin)
        // Filter out allocations where faculty role is 'admin'
        const facultyAllocations = insertedAllocations.filter(allocation => {
          const facultyMember = faculty.find(f => f.id === allocation.faculty_id);
          return facultyMember && facultyMember.role === 'faculty';
        });

        console.log(`Creating timetables for ${facultyAllocations.length} faculty allocations (excluding admin)`);

        const timetableEntries = await generateTimetable(facultyAllocations, classes);
        
        if (timetableEntries.length > 0) {
          const { data: insertedTimetable, error: timetableError } = await supabase
            .from('timetable')
            .insert(timetableEntries)
            .select();

          if (timetableError) {
            console.error('Error inserting timetable:', timetableError);
            // Don't throw - allocations are more important than timetable
          } else {
            console.log(`Successfully created ${insertedTimetable.length} timetable entries for faculty only`);
          }
        }

        res.json({
          message: 'Auto-allocation completed successfully',
          allocations_created: insertedAllocations.length,
          timetable_entries_created: timetableEntries.length,
          allocations: insertedAllocations
        });
      } else {
        res.json({
          message: 'No new allocations needed - all courses already allocated',
          allocations_created: 0
        });
      }
    } catch (err) {
      console.error('Auto-allocation error:', err);
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
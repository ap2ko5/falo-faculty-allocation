import { supabase } from '../config/database.js';

const TIMETABLE_CONFIG = {
  WORKING_DAYS_PER_WEEK: 5,
  TIME_SLOTS_PER_DAY: 8,
  TOTAL_WEEKLY_SLOTS: 40,
  ROOM_NUMBER_START: 100
};

async function generateTimetable(allocations, classes) {
  const timetableEntries = [];
  const occupiedFacultySlots = new Set();
  const occupiedClassSlots = new Set();
  const roomAssignmentCounter = {};
  const { WORKING_DAYS_PER_WEEK, TIME_SLOTS_PER_DAY } = TIMETABLE_CONFIG;
  
  const findAvailableSlot = (facultyId, classId) => {
    for (let dayOfWeek = 1; dayOfWeek <= WORKING_DAYS_PER_WEEK; dayOfWeek++) {
      for (let timeSlot = 1; timeSlot <= TIME_SLOTS_PER_DAY; timeSlot++) {
        const facultySlotKey = `${facultyId}-${dayOfWeek}-${timeSlot}`;
        const classSlotKey = `${classId}-${dayOfWeek}-${timeSlot}`;
        
        const isFacultyAvailable = !occupiedFacultySlots.has(facultySlotKey);
        const isClassAvailable = !occupiedClassSlots.has(classSlotKey);
        
        if (isFacultyAvailable && isClassAvailable) {
          return { day: dayOfWeek, slot: timeSlot };
        }
      }
    }
    return null;
  };
  
  const generateRoomNumber = (dayOfWeek, timeSlot, classId) => {
    const slotKey = `${dayOfWeek}-${timeSlot}`;
    if (!roomAssignmentCounter[slotKey]) {
      roomAssignmentCounter[slotKey] = 0;
    }
    roomAssignmentCounter[slotKey]++;
    
    const classInfo = classes.find(c => c.id === classId);
    const departmentPrefix = classInfo?.department_id ? `D${classInfo.department_id}` : 'R';
    const roomNumber = TIMETABLE_CONFIG.ROOM_NUMBER_START + roomAssignmentCounter[slotKey];
    
    return `${departmentPrefix}${roomNumber}`;
  };
  
  for (const allocation of allocations) {
    const availableSlot = findAvailableSlot(allocation.faculty_id, allocation.class_id);
    
    if (availableSlot) {
      const { day, slot: timeSlot } = availableSlot;
      const assignedRoomNumber = generateRoomNumber(day, timeSlot, allocation.class_id);
      
      timetableEntries.push({
        allocation_id: allocation.id,
        day_of_week: day,
        time_slot: timeSlot,
        room_number: assignedRoomNumber
      });
      
      const facultySlotKey = `${allocation.faculty_id}-${day}-${timeSlot}`;
      const classSlotKey = `${allocation.class_id}-${day}-${timeSlot}`;
      
      occupiedFacultySlots.add(facultySlotKey);
      occupiedClassSlots.add(classSlotKey);
    } else {
      console.warn(`Unable to schedule allocation ${allocation.id}: No available time slots. The weekly schedule (${TIMETABLE_CONFIG.TOTAL_WEEKLY_SLOTS} slots) may be full.`);
    }
  }
  
  return timetableEntries;
}

const allocationController = {
  getAll: async (req, res) => {
    try {
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

      if (allocationsResult.error) {
        console.error('Error fetching allocations:', allocationsResult.error);
        throw allocationsResult.error;
      }
      if (facultyResult.error) console.error('Error fetching faculty:', facultyResult.error);
      if (coursesResult.error) console.error('Error fetching courses:', coursesResult.error);
      if (classesResult.error) console.error('Error fetching classes:', classesResult.error);

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

      const hasRequiredFields = faculty_id && class_id && course_id && academic_year && semester;
      
      if (!hasRequiredFields) {
        return res.status(400).json({ 
          error: 'Missing required information',
          details: 'Please provide faculty, class, course, academic year, and semester',
          hint: 'All fields are required to create an allocation'
        });
      }

      const { data: existingAllocations, error: existingError } = await supabase
        .from('allocations')
        .select('id, status')
        .eq('class_id', class_id)
        .eq('course_id', course_id)
        .eq('academic_year', academic_year)
        .eq('semester', semester)
        .limit(1);

      if (existingError) {
        console.error('Error checking for duplicate allocation:', existingError);
        throw existingError;
      }

      const allocationAlreadyExists = existingAllocations?.length > 0;
      
      if (allocationAlreadyExists) {
        return res.status(409).json({ 
          error: 'Duplicate allocation detected',
          details: 'This class already has an allocation for this course in the selected academic term',
          hint: 'Please check existing allocations or choose a different class/course combination'
        });
      }
      
      const { data, error } = await supabase
        .from('allocations')
        .insert([{ 
          faculty_id, 
          class_id, 
          course_id, 
          academic_year, 
          semester,
          status: status || 'approved'
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
      const allocationId = req.params.id;
      
      const { error } = await supabase
        .from('allocations')
        .delete()
        .eq('id', allocationId);
      
      if (error) throw error;
      
      res.json({ 
        message: 'Allocation successfully removed',
        details: 'The faculty-course assignment has been deleted along with any associated timetable entries'
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to delete allocation',
        details: err.message 
      });
    }
  },

  autoAllocate: async (req, res) => {
    try {
      const { academic_year, semester } = req.body;
      
      const hasRequiredParameters = academic_year && semester;
      
      if (!hasRequiredParameters) {
        return res.status(400).json({ 
          error: 'Missing required parameters',
          details: 'Both academic year and semester are required for auto-allocation',
          hint: 'Example: academic_year: 2024, semester: 5'
        });
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

      const availableFaculty = facultyResult.data || [];
      const semesterCourses = coursesResult.data || [];
      const semesterClasses = classesResult.data || [];
      const existingAllocationsList = existingAllocations.data || [];

      console.log(`Auto-allocation data summary: ${availableFaculty.length} faculty members, ${semesterCourses.length} courses, ${semesterClasses.length} classes`);
      console.log(`Found ${existingAllocationsList.length} existing allocations for this term`);

      const createAllocationKey = (facultyId, classId, courseId) => `${facultyId}-${classId}-${courseId}`;
      const existingAllocationKeys = new Set(
        existingAllocationsList.map(allocation => 
          createAllocationKey(allocation.faculty_id, allocation.class_id, allocation.course_id)
        )
      );

      const coursesByDepartment = {};
      semesterCourses.forEach(course => {
        const departmentId = course.department_id;
        if (!coursesByDepartment[departmentId]) {
          coursesByDepartment[departmentId] = [];
        }
        coursesByDepartment[departmentId].push(course);
      });

      const classesByDepartment = {};
      semesterClasses.forEach(classInfo => {
        const departmentId = classInfo.department_id;
        if (!classesByDepartment[departmentId]) {
          classesByDepartment[departmentId] = [];
        }
        classesByDepartment[departmentId].push(classInfo);
      });

      const facultyByDepartment = {};
      availableFaculty.forEach(facultyMember => {
        const departmentId = facultyMember.department_id;
        if (!facultyByDepartment[departmentId]) {
          facultyByDepartment[departmentId] = [];
        }
        facultyByDepartment[departmentId].push(facultyMember);
      });

      const pendingAllocations = [];

      Object.keys(coursesByDepartment).forEach(departmentId => {
        const departmentCourses = coursesByDepartment[departmentId];
        const departmentClasses = classesByDepartment[departmentId] || [];
        const departmentFaculty = facultyByDepartment[departmentId] || [];

        const hasFacultyAvailable = departmentFaculty.length > 0;
        
        if (!hasFacultyAvailable) {
          console.log(`Warning: No faculty members available for department ${departmentId}. Skipping allocations for this department.`);
          return;
        }

        let facultyRotationIndex = 0;

        departmentClasses.forEach(classInfo => {
          departmentCourses.forEach(course => {
            const assignedFaculty = departmentFaculty[facultyRotationIndex % departmentFaculty.length];
            facultyRotationIndex++;

            const allocationKey = createAllocationKey(assignedFaculty.id, classInfo.id, course.id);
            const isAlreadyAllocated = existingAllocationKeys.has(allocationKey);
            
            if (isAlreadyAllocated) {
              console.log(`Skipping duplicate: Faculty ${assignedFaculty.id} already assigned to Class ${classInfo.id} for Course ${course.id}`);
              return;
            }

            const courseHasNoRequirements = !course.required_expertise || course.required_expertise.length === 0;
            const facultyHasExpertise = assignedFaculty.expertise && 
              course.required_expertise?.some(requiredSkill => 
                assignedFaculty.expertise.some(facultySkill => {
                  const skillLower = facultySkill.toLowerCase();
                  const requiredLower = requiredSkill.toLowerCase();
                  return skillLower.includes(requiredLower) || requiredLower.includes(skillLower);
                })
              );
            
            const expertiseMatches = courseHasNoRequirements || facultyHasExpertise;
            const allocationStatus = expertiseMatches ? 'approved' : 'pending';

            pendingAllocations.push({
              faculty_id: assignedFaculty.id,
              class_id: classInfo.id,
              course_id: course.id,
              academic_year,
              semester,
              status: allocationStatus
            });
          });
        });
      });

      console.log(`Generated ${pendingAllocations.length} new allocations for processing`);

      const hasAllocationsToCreate = pendingAllocations.length > 0;

      if (hasAllocationsToCreate) {
        const { data: insertedAllocations, error: insertError } = await supabase
          .from('allocations')
          .insert(pendingAllocations)
          .select();

        if (insertError) {
          console.error('Failed to save allocations to database:', insertError);
          throw new Error(`Database error: ${insertError.message}`);
        }

        console.log(`Successfully saved ${insertedAllocations.length} allocations to database`);

        const facultyOnlyAllocations = insertedAllocations.filter(allocation => {
          const facultyMember = availableFaculty.find(f => f.id === allocation.faculty_id);
          const isFacultyRole = facultyMember && facultyMember.role === 'faculty';
          return isFacultyRole;
        });

        console.log(`Generating timetables for ${facultyOnlyAllocations.length} faculty allocations (admin users excluded)`);

        const generatedTimetableEntries = await generateTimetable(facultyOnlyAllocations, semesterClasses);
        
        let timetableCount = 0;
        
        if (generatedTimetableEntries.length > 0) {
          const { data: insertedTimetable, error: timetableError } = await supabase
            .from('timetable')
            .insert(generatedTimetableEntries)
            .select();

          if (timetableError) {
            console.error('Failed to save timetable entries:', timetableError);
          } else {
            timetableCount = insertedTimetable.length;
            console.log(`Successfully created ${timetableCount} timetable entries`);
          }
        }

        res.json({
          message: 'Auto-allocation completed successfully',
          summary: `Created ${insertedAllocations.length} allocations and ${timetableCount} timetable entries`,
          allocations_created: insertedAllocations.length,
          timetable_entries_created: timetableCount,
          allocations: insertedAllocations
        });
      } else {
        res.json({
          message: 'No new allocations needed',
          details: 'All available course-class combinations are already allocated for this term',
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
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const semester = currentMonth >= 6 ? 2 : 1;

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
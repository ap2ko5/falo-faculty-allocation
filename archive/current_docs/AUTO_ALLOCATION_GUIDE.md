# Auto-Allocation & Timetable Generation Guide

## Overview
The FALO system now includes an intelligent **Auto-Allocation** feature that automatically assigns faculty members to courses and classes, and generates conflict-free timetables with room assignments.

---

## Features

### 1. **Smart Auto-Allocation**
- Automatically assigns faculty to courses based on:
  - Department matching
  - Expertise matching (optional)
  - Round-robin distribution for fair workload
  - Avoids duplicate allocations

### 2. **Automatic Timetable Generation**
- Creates conflict-free schedules **for faculty members only**
- **Admin users do not receive timetables** (they don't teach courses)
- 5 working days (Monday-Friday)
- 8 time slots per day (9:00 AM - 5:00 PM)
- Prevents scheduling conflicts:
  - Same faculty can't be in two places at once
  - Same class can't have overlapping sessions
- Auto-assigns room numbers based on department

### 3. **Status-Based Approval**
- Allocations with matching expertise → **Approved** automatically
- Allocations without matching expertise → **Pending** (requires admin review)

---

## How to Use

### Step 1: Run Auto-Allocation (Admin Only)

1. **Login as Admin**
   - Username: `admin`
   - Password: `admin123`

2. **Navigate to Dashboard**
   - Click on **"Run Auto Allocation"** card

3. **Fill in Details**
   - **Academic Year**: e.g., `2024`
   - **Semester**: Choose from `1` to `8`

4. **Click "Run Auto-Allocation"**
   - System will process all available faculty, courses, and classes
   - Creates allocations and timetables automatically
   - Shows success message with counts

### Step 2: View Generated Timetables

#### Option A: View by Class
1. Navigate to **Timetable** page
2. Select **"View By: Class"**
3. Choose a class from dropdown
4. View weekly schedule with:
   - Course names
   - Faculty assigned
   - Room numbers
   - Time slots

#### Option B: View by Faculty
1. Navigate to **Timetable** page
2. Select **"View By: Faculty"**
3. Choose a faculty member
4. View their weekly teaching schedule

---

## Timetable Structure

### Time Slots (8 slots/day)
```
Slot 1: 9:00 AM  - 10:00 AM
Slot 2: 10:00 AM - 11:00 AM
Slot 3: 11:00 AM - 12:00 PM
Slot 4: 12:00 PM - 1:00 PM  (Usually lunch break)
Slot 5: 1:00 PM  - 2:00 PM
Slot 6: 2:00 PM  - 3:00 PM
Slot 7: 3:00 PM  - 4:00 PM
Slot 8: 4:00 PM  - 5:00 PM
```

### Days
- Monday (1)
- Tuesday (2)
- Wednesday (3)
- Thursday (4)
- Friday (5)

### Room Naming Convention
- **Format**: `D{department_id}{room_number}`
- **Examples**:
  - `D1101` - Department 1, Room 101
  - `D2102` - Department 2, Room 102
  - `R101`  - Generic room (if department not specified)

---

## Auto-Allocation Algorithm

### Step-by-Step Process

1. **Data Collection**
   - Fetch all faculty members (excluding admins)
   - Fetch all courses for selected semester
   - Fetch all classes for selected semester and academic year
   - Check existing allocations to avoid duplicates

2. **Department Grouping**
   - Group courses by department
   - Group classes by department
   - Group faculty by department

3. **Round-Robin Assignment**
   - For each department:
     - For each class in department:
       - For each course in department:
         - Assign next available faculty in round-robin manner
         - Check expertise match
         - Set status (approved/pending)
         - Skip if already allocated

4. **Timetable Generation**
   - For each allocation created:
     - **Skip if faculty role is 'admin'** (admins don't need timetables)
     - Find available time slot (day + time)
     - Check faculty is free at that slot
     - Check class is free at that slot
     - Assign room number
     - Create timetable entry

5. **Conflict Prevention**
   - Track occupied faculty slots
   - Track occupied class slots
   - Ensure no double-booking

---

## API Endpoints

### Auto-Allocation
```
POST /api/allocations/auto-allocate
Authorization: Bearer {admin_token}

Request Body:
{
  "academic_year": 2024,
  "semester": 5
}

Response:
{
  "message": "Auto-allocation completed successfully",
  "allocations_created": 25,
  "timetable_entries_created": 25,
  "allocations": [...]
}
```

### View Timetable by Class
```
GET /api/timetable/class/{classId}
Authorization: Bearer {token}

Response: Array of timetable entries with allocation details
```

### View Timetable by Faculty
```
GET /api/timetable/faculty/{facultyId}
Authorization: Bearer {token}

Response: Array of timetable entries with allocation details
```

### Timetable Statistics
```
GET /api/timetable/stats
Authorization: Bearer {token}

Response:
{
  "total_entries": 25,
  "total_possible_slots": 40,
  "unique_slots_used": 25,
  "utilization_percentage": "62.50"
}
```

---

## Database Schema

### Allocations Table
```sql
CREATE TABLE allocations (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty(id),
    class_id INTEGER REFERENCES classes(id),
    course_id INTEGER REFERENCES courses(id),
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    status VARCHAR(20) DEFAULT 'active',  -- 'pending', 'approved', 'rejected', 'active'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(faculty_id, class_id, course_id, academic_year, semester)
);
```

### Timetable Table
```sql
CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER REFERENCES allocations(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
    time_slot INTEGER NOT NULL CHECK (time_slot BETWEEN 1 AND 8),
    room_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(allocation_id, day_of_week, time_slot)
);
```

---

## Example Workflow

### Scenario: Allocate Semester 5 for Year 2024

1. **Before Running**
   - 10 faculty members in CS department
   - 5 courses for semester 5
   - 2 classes (5A, 5B)
   - 0 existing allocations

2. **Run Auto-Allocation**
   ```
   POST /api/allocations/auto-allocate
   {
     "academic_year": 2024,
     "semester": 5
   }
   ```

3. **Result**
   - Creates 10 allocations (5 courses × 2 classes)
   - Each faculty gets 1-2 course assignments
   - All allocations get timetable slots
   - No scheduling conflicts

4. **Generated Schedule Example**
   ```
   Class 5A - Monday:
   09:00 - Dr. Smith    - Database Systems    - Room D1101
   10:00 - Dr. Johnson  - Operating Systems   - Room D1102
   11:00 - Dr. Williams - Computer Networks   - Room D1103
   
   Class 5A - Tuesday:
   09:00 - Dr. Brown    - Software Engineering - Room D1104
   10:00 - Dr. Davis    - Web Development      - Room D1105
   ```

---

## Troubleshooting

### Issue: "No new allocations needed"
**Cause**: All courses already allocated for this semester/year
**Solution**: 
- Delete existing allocations if re-running
- Check different semester
- Verify courses and classes exist for selected semester

### Issue: "Could not find available slot for allocation"
**Cause**: Too many allocations, not enough time slots (40 total)
**Solution**:
- System handles gracefully - creates allocation without timetable entry
- Manually assign timetable slot if needed
- Consider adding more classes across different days

### Issue: Expertise mismatch warnings
**Cause**: Faculty assigned to courses outside their expertise
**Solution**:
- Check allocation status - will be "pending"
- Admin can approve/reject manually
- Update faculty expertise in database

---

## Best Practices

1. **Run Auto-Allocation at Start of Semester**
   - Fresh allocations for new academic term
   - Clear old data if needed

2. **Review Pending Allocations**
   - Check allocations marked as "pending"
   - Approve if acceptable
   - Reject and manually reassign if needed

3. **Monitor Timetable Conflicts**
   - Use timetable viewer to check for issues
   - Verify faculty and class schedules

4. **Update Faculty Expertise**
   - Keep expertise fields current
   - Improves auto-allocation accuracy
   - Reduces pending allocations

---

## Future Enhancements

- [ ] Preference-based allocation (faculty course preferences)
- [ ] Load balancing (equal distribution of teaching hours)
- [ ] Multi-semester planning
- [ ] Export timetables to PDF/Excel
- [ ] Email notifications to faculty
- [ ] Conflict resolution suggestions
- [ ] Room capacity checking
- [ ] Lab vs. Theory session handling

---

## Support

For issues or questions:
1. Check server logs: `backend/logs/`
2. Verify database connectivity
3. Ensure all required data exists (faculty, courses, classes)
4. Check browser console for frontend errors

---

**Last Updated**: October 21, 2025
**Version**: 1.0.0

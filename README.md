Faculty Allocation System (FALO) – Complete Feature Fix and Data Integration

1. **Fix all backend errors and implement missing features:**
   - Ensure all fetches (faculty, courses, classes, allocations, timetable) from the DB return real data, not errors or blanks.
   - Implement complete CRUD for Faculty, Courses, Classes, Allocations, and Allocation Windows.
   - Timetable page must display sample data and generate views for both faculty and class.
   - Auto Allocation and Generate Timetable buttons should call backend logic; update DB and UI with results.
   - Implement proper error handling and user feedback on all failed API calls and edge cases.
   - Add “Reports” functionality to aggregate allocation/timetable stats.
   - User profile and queries pages should allow viewing and editing personal info; Queries must be submit/reviewable.
   - Admin panel to include controls for adding/editing all master data (faculty, courses, classes).
   - Settings page for user preferences and account management.

2. **Front-end UI/UX improvements:**
   - Apply modern, aesthetic backgrounds and padding to all pages (e.g., soft gradients, centered containers, clear cards).
   - Use a modern, readable sans-serif font stack by default (e.g., Inter, Roboto, Arial).
   - Style forms: rounded corners, box shadows, accent color for buttons/links, focus effects.
   - Hamburger menu must toggle the main nav on mobile; ensure accessibility.
   - Error and success messages presented as banners or modals, not raw JSON.
   - Make all layouts fully responsive and mobile-friendly.

3. **Seed the database with the following initial data:**
   - Faculty list (add all names and designations from the attached “Faculty” section of MITS CSE 2025 Handbook):
     - Dr. Rajesh Cherian Roy (Professor, Chairperson)
     - Dr. Anishin Raj M M (Associate Professor, HOD)
     - Dr. Indu MT (Assistant Professor, Asst. HoD)
     - Ms. Jisha James (Assistant Professor)
     - [...and all other faculty in the attached PDF]
   - Example Courses:
     - “CS101 - Introduction to Programming”
     - “CS201 - Data Structures”
     - “CS301 - Computer Networks”
     - (Expand with all core/elective CSE subjects from the curriculum if listed.)
   - Sample Classes:
     - “S1 CSE A”
     - “S3 CSE B”
     - (List all batches/sections given in the PDF.)
   - Users:
     - Create admin and faculty user accounts for all names in faculty list, using emails and secure default passwords.
   - Sample Allocation Windows:
     - Add at least one sample allocation window with start/end dates according to the semester calendar.
   - Timetable:
     - Add test data for weekly schedules (faculty/class) for demo/test purposes.

4. **Testing and Completion:**
   - After implementation, verify: No page or API returns errors or blank JSON, all lists load with demo data, all user/managers can log in and perform relevant actions, and every navigation item leads to a working, styled page.

Reference: All faculty names, designations, and example course/class data available in the attached MITS DEPT OF CS HANDBOOK 2025 PDF.


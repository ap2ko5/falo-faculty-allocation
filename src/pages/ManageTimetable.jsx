import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ManageTimetable() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    const { data: classData } = await supabase.from('classes').select('*');
    const { data: courseData } = await supabase.from('courses').select('*');
    const { data: facultyData } = await supabase.from('faculty').select('*');
    const { data: timetableData } = await supabase
      .from('timetable')
      .select('*, classes(*), courses(*), faculty(*)');

    setClasses(classData || []);
    setCourses(courseData || []);
    setFaculty(facultyData || []);
    setTimetable(timetableData || []);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedClass || !selectedCourse || !selectedFaculty) {
      setMessage("Please select all fields!");
      return;
    }

    const { error } = await supabase.from('timetable').insert([{
      class_id: parseInt(selectedClass),
      day: selectedDay,
      period: parseInt(selectedPeriod),
      course_id: parseInt(selectedCourse),
      faculty_id: parseInt(selectedFaculty)
    }]);

    if (!error) {
      setMessage("Timetable entry added successfully!");
      setSelectedClass("");
      setSelectedCourse("");
      setSelectedFaculty("");
      loadData();
    } else {
      setMessage("Error adding timetable entry!");
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('timetable').delete().eq('id', id);
    if (!error) {
      setMessage("Timetable entry deleted successfully!");
      loadData();
    }
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Manage Timetable</h1>
        <button onClick={() => navigate('/admin')}>Back to Dashboard</button>

        <form onSubmit={handleAdd} style={{ marginTop: '20px' }}>
          <h3>Add Timetable Entry</h3>

          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option value={c.id} key={c.id}>{c.section}</option>
            ))}
          </select>

          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {days.map(day => (
              <option value={day} key={day}>{day}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Period (1-8)" 
            min="1" 
            max="8"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            required
          />

          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(co => (
              <option value={co.id} key={co.id}>{co.coursename}</option>
            ))}
          </select>

          <select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} required>
            <option value="">Select Faculty</option>
            {faculty.map(f => (
              <option value={f.id} key={f.id}>{f.facultyname}</option>
            ))}
          </select>

          {message && <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>}
          <button type="submit">Add Entry</button>
        </form>

        <h2 style={{ marginTop: '40px' }}>Current Timetable</h2>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Day</th>
              <th>Period</th>
              <th>Course</th>
              <th>Faculty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map(tt => (
              <tr key={tt.id}>
                <td>{tt.classes?.section}</td>
                <td>{tt.day}</td>
                <td>{tt.period}</td>
                <td>{tt.courses?.coursename}</td>
                <td>{tt.faculty?.facultyname}</td>
                <td>
                  <button onClick={() => handleDelete(tt.id)} style={{ background: '#dc3545' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

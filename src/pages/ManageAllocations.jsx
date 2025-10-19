import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ManageAllocations() {
  const [faculty, setFaculty] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [status, setStatus] = useState("allocated");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    const { data: facultyData } = await supabase.from('faculty').select('*');
    const { data: classData } = await supabase.from('classes').select('*');
    const { data: courseData } = await supabase.from('courses').select('*');
    const { data: allocationData } = await supabase
      .from('allocations')
      .select('*, faculty(*), classes(*), courses(*)');

    setFaculty(facultyData || []);
    setClasses(classData || []);
    setCourses(courseData || []);
    setAllocations(allocationData || []);
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedFaculty || !selectedClass || !selectedCourse) {
      setMessage("Please select all fields!");
      return;
    }

    const { error } = await supabase.from('allocations').insert([{
      faculty_id: parseInt(selectedFaculty),
      class_id: parseInt(selectedClass),
      course_id: parseInt(selectedCourse),
      status
    }]);

    if (!error) {
      setMessage("Allocation added successfully!");
      setSelectedFaculty("");
      setSelectedClass("");
      setSelectedCourse("");
      loadData();
    } else {
      setMessage("Error adding allocation!");
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('allocations').delete().eq('id', id);
    if (!error) {
      setMessage("Allocation deleted successfully!");
      loadData();
    }
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Manage Allocations</h1>
        <button onClick={() => navigate('/admin')}>Back to Dashboard</button>

        <form onSubmit={handleAllocate} style={{ marginTop: '20px' }}>
          <h3>Add New Allocation</h3>

          <select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} required>
            <option value="">Select Faculty</option>
            {faculty.map(f => (
              <option value={f.id} key={f.id}>{f.facultyname}</option>
            ))}
          </select>

          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option value={c.id} key={c.id}>{c.section} (Sem {c.semester})</option>
            ))}
          </select>

          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(co => (
              <option value={co.id} key={co.id}>{co.coursename}</option>
            ))}
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="allocated">Allocated</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {message && <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>}
          <button type="submit">Add Allocation</button>
        </form>

        <h2 style={{ marginTop: '40px' }}>Current Allocations</h2>
        <table>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Class</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map(a => (
              <tr key={a.id}>
                <td>{a.faculty?.facultyname}</td>
                <td>{a.classes?.section}</td>
                <td>{a.courses?.coursename}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => handleDelete(a.id)} style={{ background: '#dc3545' }}>
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

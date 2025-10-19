import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [allocations, setAllocations] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    setUserName(name);

    if (!userId) {
      navigate('/');
      return;
    }

    // Fetch faculty allocations
    supabase
      .from('allocations')
      .select('*, classes(*), courses(*)')
      .eq('faculty_id', userId)
      .then(({ data }) => {
        if (data) setAllocations(data);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Faculty Dashboard</h1>
        <h3>Welcome, {userName}!</h3>

        <div className="nav-links">
          <Link to="/post-query">Post Query</Link>
          <Link to="/view-query">View Queries</Link>
          <Link to="/view-allocation">View All Allocations</Link>
          <Link to="/view-timetable">View Timetable</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
        </div>

        <h2>My Allocations</h2>
        {allocations.length === 0 ? (
          <p>No allocations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.id}>
                  <td>{a.classes?.section || 'N/A'}</td>
                  <td>{a.courses?.coursename || 'N/A'}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

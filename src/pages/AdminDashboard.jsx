import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Admin Dashboard</h1>

        <div className="nav-links">
          <Link to="/manage-allocations">Manage Allocations</Link>
          <Link to="/manage-timetable">Manage Timetable</Link>
          <Link to="/view-allocation">View All Allocations</Link>
          <Link to="/view-timetable">View Timetable</Link>
          <Link to="/view-query">View Queries</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2>Admin Controls</h2>
          <p>Use the navigation links above to manage faculty allocations, timetables, and view queries.</p>
        </div>
      </div>
    </div>
  );
}

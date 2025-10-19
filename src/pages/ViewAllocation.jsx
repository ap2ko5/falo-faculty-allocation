import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ViewAllocation() {
  const [allocations, setAllocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('allocations')
      .select('*, faculty(*), classes(*), courses(*)')
      .then(({ data }) => {
        if (data) setAllocations(data);
      });
  }, []);

  return (
    <div className="container">
      <div className="page">
        <h1>All Allocations</h1>
        <button onClick={() => navigate(-1)}>Back</button>

        {allocations.length === 0 ? (
          <p style={{ marginTop: '20px' }}>No allocations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Class</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.id}>
                  <td>{a.faculty?.facultyname || 'N/A'}</td>
                  <td>{a.faculty?.designation || 'N/A'}</td>
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

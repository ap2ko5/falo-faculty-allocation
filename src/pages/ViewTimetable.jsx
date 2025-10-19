import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ViewTimetable() {
  const [timetable, setTimetable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('timetable')
      .select('*, classes(*), faculty(*), courses(*)')
      .then(({ data }) => {
        if (data) setTimetable(data);
      });
  }, []);

  return (
    <div className="container">
      <div className="page">
        <h1>Timetable</h1>
        <button onClick={() => navigate(-1)}>Back</button>

        {timetable.length === 0 ? (
          <p style={{ marginTop: '20px' }}>No timetable entries found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Day</th>
                <th>Period</th>
                <th>Course</th>
                <th>Faculty</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map(tt => (
                <tr key={tt.id}>
                  <td>{tt.classes?.section || 'N/A'}</td>
                  <td>{tt.day}</td>
                  <td>{tt.period}</td>
                  <td>{tt.courses?.coursename || 'N/A'}</td>
                  <td>{tt.faculty?.facultyname || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

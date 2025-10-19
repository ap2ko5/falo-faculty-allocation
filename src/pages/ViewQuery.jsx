import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ViewQuery() {
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    let query = supabase.from('queries').select('*');

    // If faculty, show only their queries
    if (userType === 'faculty') {
      query = query.eq('faculty_id', parseInt(userId));
    }

    const { data } = await query;
    if (data) setQueries(data);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await supabase.from('queries').update({ status: newStatus }).eq('id', id);
    loadQueries();
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Queries</h1>
        <button onClick={() => navigate(-1)}>Back</button>

        {queries.length === 0 ? (
          <p style={{ marginTop: '20px' }}>No queries found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                {userType === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {queries.map(q => (
                <tr key={q.id}>
                  <td>{q.faculty_name}</td>
                  <td>{q.subject}</td>
                  <td>{q.message}</td>
                  <td>{q.status}</td>
                  {userType === 'admin' && (
                    <td>
                      {q.status !== 'resolved' && (
                        <button 
                          onClick={() => handleStatusUpdate(q.id, 'resolved')}
                          style={{ background: '#28a745' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

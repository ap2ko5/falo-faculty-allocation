import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PostQuery() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (!userId) {
      navigate('/');
      return;
    }

    const { error } = await supabase.from('queries').insert([{
      faculty_id: parseInt(userId),
      faculty_name: userName,
      subject,
      message,
      status: 'pending'
    }]);

    if (!error) {
      setResponse("Query posted successfully!");
      setSubject("");
      setMessage("");
    } else {
      setResponse("Error posting query!");
    }
  };

  return (
    <div className="container">
      <div className="page">
        <h1>Post Query</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="Subject" 
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
          <textarea 
            placeholder="Your query message..." 
            rows="5"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          {response && <div className={response.includes('success') ? 'success' : 'error'}>{response}</div>}
          <button type="submit">Submit Query</button>
        </form>
      </div>
    </div>
  );
}

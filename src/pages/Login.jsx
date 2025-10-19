import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (isAdmin) {
      // Admin login using admins table
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', email)
        .eq('password', password)
        .single();

      if (data) {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userId', data.id);
        navigate('/admin');
      } else {
        setError("Invalid admin credentials!");
      }
    } else {
      // Faculty login using faculty table
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('facultyname', email)
        .eq('password', password)
        .single();

      if (data) {
        localStorage.setItem('userType', 'faculty');
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.facultyname);
        navigate('/dashboard');
      } else {
        setError("Invalid faculty credentials!");
      }
    }
  };

  return (
    <div className="container">
      <div className="page" style={{ maxWidth: '500px', margin: '100px auto' }}>
        <h1>FALO Login</h1>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username/Email" 
            value={email}
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              checked={isAdmin} 
              onChange={e => setIsAdmin(e.target.checked)} 
            />
            Login as Admin
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

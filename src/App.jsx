import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageAllocations from './pages/ManageAllocations';
import ViewAllocation from './pages/ViewAllocation';
import ViewTimetable from './pages/ViewTimetable';
import ManageTimetable from './pages/ManageTimetable';
import PostQuery from './pages/PostQuery';
import ViewQuery from './pages/ViewQuery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-allocations" element={<ManageAllocations />} />
        <Route path="/view-allocation" element={<ViewAllocation />} />
        <Route path="/view-timetable" element={<ViewTimetable />} />
        <Route path="/manage-timetable" element={<ManageTimetable />} />
        <Route path="/post-query" element={<PostQuery />} />
        <Route path="/view-query" element={<ViewQuery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

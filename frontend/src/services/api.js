const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
};

export const allocationService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/allocations`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch allocations');
    return response.json();
  },

  create: async (allocationData) => {
    const response = await fetch(`${API_URL}/allocations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(allocationData),
    });
    if (!response.ok) throw new Error('Failed to create allocation');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/allocations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to delete allocation');
    return response.json();
  },
};

export const timetableService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/timetable`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch timetable');
    return response.json();
  },

  getByClass: async (classId) => {
    const response = await fetch(`${API_URL}/timetable/class/${classId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch class timetable');
    return response.json();
  },

  getByFaculty: async (facultyId) => {
    const response = await fetch(`${API_URL}/timetable/faculty/${facultyId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch faculty timetable');
    return response.json();
  },
};
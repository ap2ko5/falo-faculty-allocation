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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Registration failed: ${response.status}`);
    }
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

  approve: async (id) => {
    const response = await fetch(`${API_URL}/allocations/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to approve allocation');
    return response.json();
  },

  reject: async (id) => {
    const response = await fetch(`${API_URL}/allocations/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to reject allocation');
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

  autoAllocate: async (data) => {
    const response = await fetch(`${API_URL}/allocations/auto-allocate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to run auto-allocation');
    return response.json();
  },

  getWindows: async () => {
    const response = await fetch(`${API_URL}/allocations/windows`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch allocation windows');
    return response.json();
  },

  createWindow: async (windowData) => {
    const response = await fetch(`${API_URL}/allocations/windows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(windowData),
    });
    if (!response.ok) throw new Error('Failed to create allocation window');
    return response.json();
  },

  closeWindow: async (windowId) => {
    const response = await fetch(`${API_URL}/allocations/windows/${windowId}/close`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to close allocation window');
    return response.json();
  },
};

export const facultyService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/faculty`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch faculty');
    return response.json();
  },

  create: async (facultyData) => {
    const response = await fetch(`${API_URL}/faculty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(facultyData),
    });
    if (!response.ok) throw new Error('Failed to create faculty');
    return response.json();
  },

  update: async (id, facultyData) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(facultyData),
    });
    if (!response.ok) throw new Error('Failed to update faculty');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to delete faculty');
    return response.json();
  },
};

export const courseService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/courses`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  create: async (courseData) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  update: async (id, courseData) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return response.json();
  },
};

export const departmentService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  },
};

export const classService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/classes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },
};

export const timetableService = {
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

  getAll: async () => {
    const response = await fetch(`${API_URL}/timetable`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch all timetables');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/timetable/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch timetable stats');
    return response.json();
  },

  generate: async (data) => {
    const response = await fetch(`${API_URL}/timetable/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to generate timetables');
    return response.json();
  },
};
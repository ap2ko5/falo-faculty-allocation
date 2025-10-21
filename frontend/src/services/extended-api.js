// Add services for faculty, courses, classes, departments
export const facultyService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/faculty`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch faculty');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
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

  getById: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch course');
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

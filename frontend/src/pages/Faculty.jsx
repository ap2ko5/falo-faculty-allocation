import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { facultyService, departmentService } from '../services/api';

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    department_id: '',
    designation: '',
    role: 'faculty',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Username', width: 250 },
    { 
      field: 'department_id', 
      headerName: 'Department', 
      width: 180,
      valueGetter: (params) => {
        // Check if row exists and has department data
        if (!params.row) {
          return 'N/A';
        }
        // Use department_name field added by backend, or nested departments.name
        return params.row.department_name || params.row.departments?.name || 'N/A';
      }
    },
    { field: 'designation', headerName: 'Designation', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'admin' ? 'error' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            startIcon={<EditIcon />}
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [facultyData, deptData] = await Promise.all([
        facultyService.getAll(),
        departmentService.getAll(),
      ]);
      setFaculty(facultyData);
      // Sort departments alphabetically
      const sortedDepts = (deptData || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setDepartments(sortedDepts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditMode(true);
    setCurrentId(row.id);
    setFormData({
      name: row.name,
      username: row.email, // username is stored in email column
      password: '', // Don't show password
      department_id: row.department_id || '',
      designation: row.designation || '',
      role: row.role,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submitData = {
        name: formData.name,
        email: formData.username, // Store username in email field
        department_id: parseInt(formData.department_id),
        designation: formData.designation,
        role: formData.role,
      };

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }

      if (editMode) {
        await facultyService.update(currentId, submitData);
      } else {
        await facultyService.create(submitData);
      }
      
      setOpenDialog(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await facultyService.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      department_id: '',
      designation: '',
      role: 'faculty',
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Faculty Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Faculty
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={faculty}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              helperText="Username for login (no email required)"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editMode}
              helperText={editMode ? "Leave blank to keep existing password" : "Minimum 6 characters"}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department_id}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Designation"
              margin="normal"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g., Professor, Associate Professor, Assistant Professor"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <MenuItem value="faculty">Faculty</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

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
import { courseService, departmentService } from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department_id: '',
    semester: '',
    credits: 3,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'code', headerName: 'Course Code', width: 120 },
    { field: 'name', headerName: 'Course Name', width: 300 },
    { 
      field: 'department_id', 
      headerName: 'Department', 
      width: 180,
      valueGetter: (params) => {
        // Check if row and departments exist
        if (!params.row || !params.row.departments) {
          return 'N/A';
        }
        // Use the nested department name from the API response
        return params.row.departments.name || 'N/A';
      }
    },
    { 
      field: 'semester', 
      headerName: 'Semester', 
      width: 100,
      renderCell: (params) => (
        <Chip label={`Sem ${params.value}`} color="primary" size="small" />
      ),
    },
    { field: 'credits', headerName: 'Credits', width: 100 },
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
      const [coursesData, deptData] = await Promise.all([
        courseService.getAll(),
        departmentService.getAll(),
      ]);
      setCourses(coursesData);
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
      code: row.code,
      name: row.name,
      department_id: row.department_id || '',
      semester: row.semester,
      credits: row.credits,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submitData = {
        ...formData,
        department_id: parseInt(formData.department_id),
        semester: parseInt(formData.semester),
        credits: parseInt(formData.credits),
      };

      if (editMode) {
        await courseService.update(currentId, submitData);
      } else {
        await courseService.create(submitData);
      }
      
      setOpenDialog(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      department_id: '',
      semester: '',
      credits: 3,
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
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={courses}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Course Code"
              margin="normal"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              placeholder="e.g., CS501"
            />
            <TextField
              fullWidth
              label="Course Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Database Management Systems"
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Semester</InputLabel>
              <Select
                value={formData.semester}
                label="Semester"
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Credits"
              type="number"
              margin="normal"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              required
              inputProps={{ min: 1, max: 6 }}
            />
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

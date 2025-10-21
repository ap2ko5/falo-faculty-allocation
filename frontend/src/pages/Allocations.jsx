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
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, RequestPage as RequestPageIcon } from '@mui/icons-material';
import { allocationService, facultyService, courseService, classService } from '../services/api';

export default function Allocations({ user }) {
  const [allocations, setAllocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: '',
    courseId: '',
    classId: '',
    academicYear: new Date().getFullYear(),
    semester: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  const getStatusColor = (status) => {
    const statusLower = (status || 'active').toLowerCase();
    if (statusLower === 'pending') return 'warning';
    if (statusLower === 'approved' || statusLower === 'active') return 'success';
    if (statusLower === 'rejected') return 'error';
    return 'default';
  };

  const handleApprove = async (id) => {
    try {
      await allocationService.approve(id);
      fetchAllocations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this allocation?')) {
      try {
        await allocationService.reject(id);
        fetchAllocations();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'facultyName', headerName: 'Faculty', width: 200 },
    { field: 'courseName', headerName: 'Course', width: 220 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'active'} 
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 180,
      valueGetter: (params) => {
        if (params?.row?.createdAt) {
          return new Date(params.row.createdAt).toLocaleDateString();
        }
        return 'N/A';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isAdmin ? 180 : 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAdmin && params.row.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handleApprove(params.row.id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleReject(params.row.id)}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {isAdmin && (
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    // Load reference data first, then allocations
    const loadRefData = async () => {
      try {
        const [f, c, cl] = await Promise.all([
          facultyService.getAll(),
          courseService.getAll(),
          classService.getAll(),
        ]);
        console.log('Reference data loaded:', { 
          faculties: f?.length || 0, 
          courses: c?.length || 0, 
          classes: cl?.length || 0 
        });
        console.log('Classes data:', cl);
        setFaculties(f || []);
        setCourses(c || []);
        setClasses(cl || []);
      } catch (e) {
        // Not fatal for page render; will show IDs if names unavailable
        console.error('Failed to load reference data', e);
        setError('Warning: Could not load reference data. Showing IDs instead of names.');
      } finally {
        fetchAllocations();
      }
    };
    loadRefData();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const data = await allocationService.getAll();
      setAllocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (isFaculty && !user?.id) {
      setError('User information not available. Please refresh the page and try again.');
      return;
    }
    
    if (isAdmin && !formData.facultyId) {
      setError('Please select a faculty member.');
      return;
    }
    
    if (!formData.courseId || !formData.classId || !formData.semester) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      const payload = {
        faculty_id: isFaculty ? user.id : Number(formData.facultyId),
        course_id: Number(formData.courseId),
        class_id: Number(formData.classId),
        academic_year: Number(formData.academicYear) || new Date().getFullYear(),
        semester: Number(formData.semester),
        status: isFaculty ? 'pending' : 'approved', // Faculty submissions are pending, admin allocations are approved
      };
      
      console.log('Submitting allocation:', payload);
      await allocationService.create(payload);
      
      setOpenDialog(false);
      setFormData({
        facultyId: '',
        courseId: '',
        classId: '',
        academicYear: new Date().getFullYear(),
        semester: '',
      });
      fetchAllocations();
      
      if (isFaculty) {
        // Show success message for faculty preference submission
        setTimeout(() => {
          setError('Preference submitted successfully! Waiting for admin approval.');
        }, 100);
      }
    } catch (err) {
      console.error('Allocation submission error:', err);
      setError(err.message || 'Failed to create allocation. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await allocationService.delete(id);
        fetchAllocations();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleOpenDialog = () => {
    // Check if user data is available for faculty users
    if (isFaculty && !user?.id) {
      setError('User information not loaded. Please refresh the page and try again.');
      return;
    }
    setError(''); // Clear any previous errors
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" className="page-title">
            {isFaculty ? 'My Allocation Preferences' : 'Faculty Allocations'}
          </Typography>
          <Typography variant="body2" className="page-subtitle muted">
            {isFaculty ? 'Submit your preferred classes. Admin will review.' : 'Manage faculty allocations and approvals.'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={isFaculty ? <RequestPageIcon /> : <AddIcon />}
          onClick={handleOpenDialog}
        >
          {isFaculty ? 'Submit Preference' : 'New Allocation'}
        </Button>
      </Box>

      {error && (
        <Alert severity={error.includes('successfully') ? 'success' : (error.startsWith('Warning') ? 'warning' : 'error')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper className="card-section" sx={{ height: 520, width: '100%', p: 0 }}>
        <DataGrid
          rows={allocations.map((a, index) => {
            // First try to use joined data from backend, fallback to local lookup
            const faculty = a.faculty || faculties.find((f) => f.id === a.faculty_id);
            const course = a.course || courses.find((c) => c.id === a.course_id);
            const klass = a.class || classes.find((cl) => cl.id === a.class_id);
            
            // Debug logging for first row
            if (index === 0) {
              console.log('First allocation mapping:', {
                allocation: a,
                faculty_joined: a.faculty,
                course_joined: a.course,
                class_joined: a.class,
                faculty_found: faculty,
                course_found: course,
                class_found: klass
              });
            }
            
            // Build class name
            let className = klass?.name || '';
            if (klass?.section) {
              className = `${className} ${klass.section}`.trim();
            }
            // Fallback to class_id if nothing else works
            if (!className) {
              className = `Class #${a.class_id}`;
            }
            
            return {
              id: a.id,
              facultyName: faculty?.name || `Faculty #${a.faculty_id}`,
              courseName: course?.name || course?.title || `Course #${a.course_id}`,
              className,
              semester: a.semester,
              status: a.status || 'active',
              createdAt: a.created_at,
            };
          })}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          loading={loading}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-row': {
              maxHeight: '56px !important',
              alignItems: 'center',
            },
            '& .MuiDataGrid-cell': {
              py: 1.5,
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: 'rgba(15, 23, 42, 0.02)'
            },
            border: 'none'
          }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isFaculty ? 'Submit Allocation Preference' : 'New Allocation'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isFaculty && (
              <Alert severity="info">
                Your preference will be submitted for admin approval.
              </Alert>
            )}
            
            {/* Quick Reference */}
            <Alert severity="warning" sx={{ mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom><strong>Quick Reference - Use these IDs:</strong></Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <strong>Faculty:</strong> 1=Dr. John Smith, 2=Dr. Jane Doe, 3=Prof. Bob Wilson<br />
                <strong>Courses:</strong> 1=Data Structures, 2=Algorithms, 3=Database Systems, 4=Web Development<br />
                <strong>Classes:</strong> 1=CSEA, 2=CSEB, 3=MEA, 4=CEA
              </Typography>
            </Alert>

            {isAdmin && (
              <TextField
                fullWidth
                label="Faculty ID"
                type="number"
                value={formData.facultyId}
                onChange={(e) =>
                  setFormData({ ...formData, facultyId: e.target.value })
                }
                required
                helperText="Enter the numeric Faculty ID (e.g., 1, 2, 3)"
              />
            )}
            <TextField
              fullWidth
              label="Course ID"
              type="number"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              required
              helperText="Enter the numeric Course ID (e.g., 1, 2, 3, 4)"
            />
            <TextField
              fullWidth
              label="Class ID"
              type="number"
              value={formData.classId}
              onChange={(e) =>
                setFormData({ ...formData, classId: e.target.value })
              }
              required
              helperText="Enter the numeric Class ID (e.g., 1=CSEA, 2=CSEB, 3=MEA, 4=CEA)"
            />
            <TextField
              fullWidth
              label="Academic Year"
              type="number"
              value={formData.academicYear}
              onChange={(e) =>
                setFormData({ ...formData, academicYear: Number(e.target.value) })
              }
              required
            />
            <TextField
              fullWidth
              label="Semester"
              type="number"
              inputProps={{ min: 1, max: 8 }}
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: Number(e.target.value) })
              }
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isFaculty ? 'Submit Preference' : 'Create Allocation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
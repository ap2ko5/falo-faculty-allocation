import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  Person as PersonIcon, 
  Class as ClassIcon,
  AutoFixHigh as AutoFixIcon 
} from '@mui/icons-material';
import { facultyService, classService, timetableService } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export default function Timetable({ user }) {
  const [viewType, setViewType] = useState('class'); // 'class' or 'faculty'
  const [selectedId, setSelectedId] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generateDialog, setGenerateDialog] = useState(false);
  const [generateData, setGenerateData] = useState({
    academic_year: new Date().getFullYear(),
    semester: 1
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const isAdmin = user?.role === 'admin';

  const formatClassDisplay = (cls) => {
    if (!cls) return '';
    const deptSource = cls.departments || cls.department;
    const deptLabel = deptSource?.code || deptSource?.name || cls.name || 'Class';
    const sectionLabel = cls.section ? cls.section.toString().trim() : '';
    const classLabel = [deptLabel, sectionLabel].filter(Boolean).join(' ');
    return `${classLabel} - Semester ${cls.semester}`;
  };

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchTimetable();
    }
  }, [selectedId, viewType]);

  const fetchReferenceData = async () => {
    setError('');
    try {
      const [facultyData, classData] = await Promise.all([
        facultyService.getAll(),
        classService.getAll(),
      ]);
      
      console.log('Faculty data:', facultyData);
      console.log('Class data:', classData);
      
      const nonAdminFaculty = (facultyData || []).filter(f => f.role !== 'admin');
      const sortedFaculty = nonAdminFaculty.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      
      const sortedClasses = (classData || []).sort((a, b) => {
        const nameA = a.display_name || a.name || '';
        const nameB = b.display_name || b.name || '';
        return nameA.localeCompare(nameB);
      });
      
      setFaculties(sortedFaculty);
      setClasses(sortedClasses);

      if (!isAdmin && user?.id && viewType === 'faculty') {
        setSelectedId(user.id);
      }
    } catch (err) {
      console.error('Error fetching reference data:', err);
      setError(`Failed to load reference data: ${err.message || 'Unknown error'}`);
    }
  };

  const fetchTimetable = async () => {
    setLoading(true);
    setError('');
    try {
      const data = viewType === 'class' 
        ? await timetableService.getByClass(selectedId)
        : await timetableService.getByFaculty(selectedId);

      console.log('Timetable data:', data);
      setTimetableData(data);
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetables = async () => {
    setLoading(true);
    try {
      const result = await timetableService.generate(generateData);
      setGenerateDialog(false);
      setSnackbar({
        open: true,
        message: `Timetables generated successfully! Created ${result.timetable_entries_created || 0} entries for ${result.allocations_processed || 0} allocations.`,
        severity: 'success'
      });
      if (selectedId) {
        await fetchTimetable();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Convert timetable data to a grid structure
  const buildTimetableGrid = () => {
    const grid = Array(TIME_SLOTS.length).fill(null).map(() => Array(DAYS.length).fill(null));

    timetableData.forEach(entry => {
      const dayIndex = entry.day_of_week - 1; // Convert 1-5 to 0-4
      const slotIndex = entry.time_slot - 1; // Convert 1-8 to 0-7

      if (dayIndex >= 0 && dayIndex < DAYS.length && slotIndex >= 0 && slotIndex < TIME_SLOTS.length) {
        grid[slotIndex][dayIndex] = entry;
      }
    });

    return grid;
  };

  const grid = buildTimetableGrid();

  const renderCellContent = (entry) => {
    if (!entry) return '-';

    const allocation = entry.allocation;
    if (!allocation) return '-';

    if (viewType === 'class') {
      return (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {allocation.course?.name || allocation.course?.code || 'Course'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {allocation.faculty?.name || 'Faculty'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Room: {entry.room_number}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {allocation.course?.name || allocation.course?.code || 'Course'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Section {allocation.class?.section || '-'} - Sem {allocation.class?.semester || '-'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Room: {entry.room_number}
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" className="page-title" gutterBottom>
          <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Timetable Viewer
        </Typography>
        <Typography variant="body2" className="page-subtitle muted">
          View auto-generated class schedules
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        {isAdmin && (
          <Button
            variant="contained"
            color="success"
            startIcon={<AutoFixIcon />}
            onClick={() => setGenerateDialog(true)}
            disabled={loading}
          >
            Generate Timetables
          </Button>
        )}
      </Box>

      {/* Info Alert for Admins */}
      {isAdmin && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Note:</strong> Timetables are only generated for faculty members. Admin users do not have teaching schedules.
          Use the filters below to view timetables for specific classes or faculty members.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Classes
              </Typography>
              <Typography variant="h5">{classes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Faculty Members
              </Typography>
              <Typography variant="h5">{faculties.length}</Typography>
              <Typography variant="caption" color="text.secondary">
                (Excludes admins)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Scheduled Slots
              </Typography>
              <Typography variant="h5">{timetableData.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {isAdmin && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>View By</InputLabel>
                <Select
                  value={viewType}
                  label="View By"
                  onChange={(e) => {
                    setViewType(e.target.value);
                    setSelectedId('');
                    setTimetableData([]);
                  }}
                  startAdornment={
                    viewType === 'class' ? (
                      <ClassIcon sx={{ mr: 1, fontSize: 18 }} />
                    ) : (
                      <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                    )
                  }
                >
                  <MenuItem value="class">
                    By Class
                  </MenuItem>
                  <MenuItem value="faculty">
                    By Faculty
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={isAdmin ? 6 : 12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                {viewType === 'class' ? 'Select Class' : 'Select Faculty'}
              </InputLabel>
              <Select
                value={selectedId}
                label={viewType === 'class' ? 'Select Class' : 'Select Faculty'}
                onChange={(e) => setSelectedId(e.target.value)}
                displayEmpty
                notched
                renderValue={(value) => {
                  if (!value) {
                    return <span style={{ color: '#757575' }}>Choose {viewType === 'class' ? 'a class' : 'a faculty member'}</span>;
                  }
                  if (viewType === 'class') {
                    const cls = classes.find(c => c.id === value);
                    return cls ? (cls.display_name || formatClassDisplay(cls)) : value;
                  } else {
                    const faculty = faculties.find(f => f.id === value);
                    return faculty ? `${faculty.name} (${faculty.email})` : value;
                  }
                }}
              >
                {viewType === 'class' ? (
                  classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.display_name || formatClassDisplay(cls)}
                    </MenuItem>
                  ))
                ) : (
                  faculties.map((faculty) => (
                    <MenuItem key={faculty.id} value={faculty.id}>
                      {faculty.name} ({faculty.email})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : selectedId && timetableData.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Time</TableCell>
                {DAYS.map((day) => (
                  <TableCell key={day} align="center" sx={{ fontWeight: 'bold', minWidth: 150 }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {grid.map((row, slotIndex) => (
                <TableRow key={slotIndex}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {TIME_SLOTS[slotIndex]}
                  </TableCell>
                  {row.map((cell, dayIndex) => (
                    <TableCell
                      key={dayIndex}
                      align="center"
                      sx={{
                        backgroundColor: cell ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        verticalAlign: 'top',
                        p: 1.5,
                      }}
                    >
                      {renderCellContent(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : selectedId ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No timetable entries found for the selected {viewType}.
          {isAdmin && ' Run auto-allocation or generate timetables.'}
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please select a {viewType} to view the timetable.
        </Alert>
      )}

      {/* Generate Timetables Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Timetables</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
              This will generate timetable schedules for all approved faculty allocations in the specified academic year and semester.
            </Alert>
            <TextField
              label="Academic Year"
              type="number"
              fullWidth
              value={generateData.academic_year}
              onChange={(e) => setGenerateData({ ...generateData, academic_year: parseInt(e.target.value) })}
              helperText="Enter the academic year (e.g., 2024)"
            />
            <TextField
              label="Semester"
              type="number"
              fullWidth
              value={generateData.semester}
              onChange={(e) => setGenerateData({ ...generateData, semester: parseInt(e.target.value) })}
              inputProps={{ min: 1, max: 8 }}
              helperText="Enter semester (1-8)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateTimetables} 
            variant="contained" 
            color="success"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Timetables'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

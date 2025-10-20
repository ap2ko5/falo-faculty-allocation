import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Logout as LogoutIcon,
  NotificationsActive as NotificationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { allocationService, timetableService } from '../../services/api';
import DashboardLayout from '../dashboard/DashboardLayout';

const FacultyDashboard = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [queryForm, setQueryForm] = useState({ subject: '', message: '' });
  const [nextClass, setNextClass] = useState(null);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch next class
      const timetableData = await timetableService.getByFaculty(user.id);
      const now = new Date();
      setNextClass(timetableData.find(slot => {
        const [hours, minutes] = slot.time.split(':');
        const slotTime = new Date();
        slotTime.setHours(parseInt(hours), parseInt(minutes));
        return slotTime > now;
      }));

      // Fetch allocations
      const allocationsData = await allocationService.getAll();
      setAllocations(allocationsData.filter(a => a.facultyId === user.id));
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement query submission API
      setSnackbar({ open: true, message: 'Query submitted successfully!', severity: 'success' });
      setOpenDialog(false);
      setQueryForm({ subject: '', message: '' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const InfoCard = ({ title, content, icon: Icon, color = "primary" }) => (
    <Card
      sx={{
        height: '100%',
        borderLeft: 4,
        borderColor: `${color}.main`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'all 0.3s ease',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: `${color}.main`, mr: 1 }} />
          <Typography variant="h6" component="div" color={`${color}.main`}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1">{content}</Typography>
      </CardContent>
    </Card>
  );

  const ActionCard = ({ title, description, icon: Icon, color = "primary", onClick }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'all 0.3s ease',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: `${color}.main`, fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout role="faculty">
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username || 'Faculty'}
        </Typography>

        <Grid container spacing={3}>
          {/* Status Cards */}
          <Grid item xs={12} md={6}>
            <InfoCard
              title="Next Class"
              content={nextClass ? `${nextClass.course} at ${nextClass.time}` : 'No upcoming classes'}
              icon={SchoolIcon}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard
              title="Current Allocations"
              content={`${allocations.length} courses assigned`}
              icon={NotificationIcon}
              color="secondary"
            />
          </Grid>

          {/* Action Cards */}
          <Grid item xs={12} md={6}>
            <ActionCard
              title="My Allocations"
              description="View your current course assignments"
              icon={SchoolIcon}
              color="info"
              onClick={() => navigate('/allocations')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionCard
              title="My Timetable"
              description="Check your weekly schedule"
              icon={ScheduleIcon}
              color="success"
              onClick={() => navigate('/timetable')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionCard
              title="Submit Query"
              description="Send a request or feedback to admin"
              icon={CommentIcon}
              color="warning"
              onClick={() => setOpenDialog(true)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionCard
              title="Logout"
              description="Securely exit your account"
              icon={LogoutIcon}
              color="error"
              onClick={onLogout}
            />
          </Grid>
        </Grid>

        {/* Query Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Query or Feedback</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Subject"
              margin="normal"
              value={queryForm.subject}
              onChange={(e) => setQueryForm({ ...queryForm, subject: e.target.value })}
            />
            <TextField
              fullWidth
              label="Message"
              margin="normal"
              multiline
              rows={4}
              value={queryForm.message}
              onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitQuery} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Feedback Snackbar */}
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
      </Box>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
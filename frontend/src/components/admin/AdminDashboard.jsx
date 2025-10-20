import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  AutoFixHigh as AutoFixIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CalendarMonth as CalendarIcon,
  DateRange as DateRangeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { allocationService, timetableService } from '../../services/api';
import DashboardLayout from '../dashboard/DashboardLayout';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAutoAllocation = async () => {
    setLoading(true);
    try {
      await allocationService.autoAllocate();
      setSnackbar({ open: true, message: 'Auto allocation completed successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetable = async () => {
    setLoading(true);
    try {
      await timetableService.generate();
      setSnackbar({ open: true, message: 'Timetable generated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ActionButton = ({ icon: Icon, color, onClick, children }) => (
    <Button
      variant="contained"
      color={color}
      onClick={onClick}
      startIcon={<Icon />}
      fullWidth
      sx={{
        py: 1.5,
        textTransform: 'none',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      {children}
    </Button>
  );

  const ActionCard = ({ title, description, icon: Icon, color = "primary", onClick }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 1,
              '&:hover': { bgcolor: `${color}.light` },
            }}
          >
            <Icon />
          </IconButton>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <ActionButton icon={Icon} color={color} onClick={onClick}>
          {title}
        </ActionButton>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout role="admin">
      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="Run Auto Allocation"
              description="Automatically allocate faculty to courses based on availability and expertise"
              icon={AutoFixIcon}
              color="primary"
              onClick={handleAutoAllocation}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="Generate Timetable"
              description="Create optimized class schedules avoiding conflicts"
              icon={ScheduleIcon}
              color="secondary"
              onClick={handleGenerateTimetable}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="View Allocations"
              description="Review and manage current faculty allocations"
              icon={GroupIcon}
              color="info"
              onClick={() => navigate('/allocations')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="View Timetable"
              description="Check complete timetable by class or faculty"
              icon={CalendarIcon}
              color="success"
              onClick={() => navigate('/timetable')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="Manage Windows"
              description="Control allocation periods and deadlines"
              icon={DateRangeIcon}
              color="warning"
              onClick={() => navigate('/windows')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActionCard
              title="Logout"
              description="Securely exit the admin dashboard"
              icon={LogoutIcon}
              color="error"
              onClick={onLogout}
            />
          </Grid>
        </Grid>

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

export default AdminDashboard;
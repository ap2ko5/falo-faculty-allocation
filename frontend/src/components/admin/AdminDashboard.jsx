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
import { allocationService } from '../../services/api';
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ActionButton = ({ icon: Icon, color, onClick, children }) => (
    <Button
      variant="contained"
      color={color}
      onClick={onClick}
      startIcon={<Icon sx={{ fontSize: 24 }} />}
      fullWidth
      sx={{
        py: 2,
        fontSize: '1rem',
        fontWeight: 600,
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
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ p: 3, pb: '24px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <IconButton
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
              width: 56,
              height: 56,
              '&:hover': { bgcolor: `${color}.light` },
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h5" component="div" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1, fontSize: '0.95rem' }}>
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
      <Box sx={{ position: 'relative', p: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Manage Faculty"
              description="Add, edit, and view all faculty members"
              icon={GroupIcon}
              color="primary"
              onClick={() => navigate('/faculty')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Manage Courses"
              description="Add, edit, and view all courses"
              icon={ScheduleIcon}
              color="secondary"
              onClick={() => navigate('/courses')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="View Allocations"
              description="Review and manage current faculty allocations"
              icon={CalendarIcon}
              color="info"
              onClick={() => navigate('/allocations')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Run Auto Allocation"
              description="Automatically allocate faculty to courses"
              icon={AutoFixIcon}
              color="success"
              onClick={handleAutoAllocation}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Manage Windows"
              description="Control allocation periods and deadlines"
              icon={DateRangeIcon}
              color="warning"
              onClick={() => navigate('/windows')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
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
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
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Logout as LogoutIcon,
  NotificationsActive as NotificationIcon,
  Assignment as AssignmentIcon,
  Feedback as FeedbackIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { allocationService } from '../../services/api';
import DashboardLayout from '../dashboard/DashboardLayout';

const FacultyDashboard = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [queryForm, setQueryForm] = useState({ subject: '', message: '' });
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const allocationsData = await allocationService.getAll();
      const userAllocations = allocationsData.filter(a => a.faculty_id === user?.id);
      console.log('Faculty allocations:', userAllocations);
      setAllocations(userAllocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setSnackbar({ open: true, message: 'Failed to fetch allocations', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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

  const getStatusColor = (status) => {
    const statusLower = (status || 'active').toLowerCase();
    if (statusLower === 'pending') return 'warning';
    if (statusLower === 'approved' || statusLower === 'active') return 'success';
    if (statusLower === 'rejected') return 'error';
    return 'default';
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || 'active').toLowerCase();
    if (statusLower === 'pending') return <PendingIcon fontSize="small" />;
    if (statusLower === 'approved' || statusLower === 'active') return <CheckCircleIcon fontSize="small" />;
    if (statusLower === 'rejected') return <CancelIcon fontSize="small" />;
    return null;
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
    <DashboardLayout role="faculty">
      <Box sx={{ position: 'relative', p: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
          Welcome, {user?.name || 'Faculty'}
        </Typography>

        {/* My Allocations Section */}
        {allocations.length > 0 && (
          <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ fontSize: 32, mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                My Current Allocations
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Course</strong></TableCell>
                      <TableCell><strong>Class</strong></TableCell>
                      <TableCell><strong>Semester</strong></TableCell>
                      <TableCell><strong>Academic Year</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocations.map((allocation) => (
                      <TableRow 
                        key={allocation.id}
                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {allocation.course?.name || allocation.course?.title || `Course #${allocation.course_id}`}
                          </Typography>
                          {allocation.course?.code && (
                            <Typography variant="caption" color="text.secondary">
                              {allocation.course.code}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          Section {allocation.class?.section || '-'}
                        </TableCell>
                        <TableCell>{allocation.semester}</TableCell>
                        <TableCell>{allocation.academic_year}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(allocation.status)}
                            label={allocation.status || 'active'}
                            color={getStatusColor(allocation.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Allocations: <strong>{allocations.length}</strong>
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/allocations')}
                startIcon={<AssignmentIcon />}
              >
                View All Details
              </Button>
            </Box>
          </Paper>
        )}

        {/* No Allocations Message */}
        {allocations.length === 0 && !loading && (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body1">
              You currently have no course allocations. You can submit preferences from the <strong>My Allocations</strong> page.
            </Typography>
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="My Allocations"
              description="View and manage your current course assignments"
              icon={AssignmentIcon}
              color="primary"
              onClick={() => navigate('/allocations')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Submit Query"
              description="Send feedback or inquiries to the admin"
              icon={FeedbackIcon}
              color="success"
              onClick={() => setOpenDialog(true)}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <ActionCard
              title="Logout"
              description="Securely exit the faculty dashboard"
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
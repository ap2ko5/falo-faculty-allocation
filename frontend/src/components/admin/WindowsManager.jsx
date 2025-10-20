import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from '@mui/icons-material';
import { allocationService } from '../../services/api';
import DashboardLayout from '../dashboard/DashboardLayout';

const WindowsManager = () => {
  const [windows, setWindows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchWindows();
  }, []);

  const fetchWindows = async () => {
    setLoading(true);
    try {
      const data = await allocationService.getWindows();
      setWindows(data);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWindow = async () => {
    setLoading(true);
    try {
      await allocationService.createWindow(formData);
      setSnackbar({ open: true, message: 'Window created successfully!', severity: 'success' });
      setOpenDialog(false);
      setFormData({ startTime: '', endTime: '' });
      fetchWindows();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWindow = async (windowId) => {
    if (!confirm('Closing the window will trigger auto-allocation. Continue?')) return;
    
    setLoading(true);
    try {
      await allocationService.closeWindow(windowId);
      setSnackbar({ 
        open: true, 
        message: 'Window closed and auto-allocation triggered!', 
        severity: 'success' 
      });
      fetchWindows();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <DashboardLayout role="admin">
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Allocation Windows
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Window
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {windows.map((window) => (
                <TableRow
                  key={window.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: window.isClosed ? 'action.hover' : 'inherit',
                  }}
                >
                  <TableCell>{window.id}</TableCell>
                  <TableCell>
                    {new Date(window.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(window.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {window.isClosed ? (
                        <LockIcon color="error" fontSize="small" />
                      ) : (
                        <UnlockIcon color="success" fontSize="small" />
                      )}
                      {window.isClosed ? 'Closed' : 'Open'}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {!window.isClosed && (
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<LockIcon />}
                        onClick={() => handleCloseWindow(window.id)}
                      >
                        Close Window
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {windows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No allocation windows found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Window Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create New Allocation Window</DialogTitle>
          <DialogContent>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateWindow} variant="contained">
              Create
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

export default WindowsManager;
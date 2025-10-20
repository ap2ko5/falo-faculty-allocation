import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout, user }) {
  const navigate = useNavigate();

  const AdminNav = () => (
    <Box>
      <Button color="inherit" onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
      <Button color="inherit" onClick={() => navigate('/allocations')}>
        Allocations
      </Button>
      <Button color="inherit" onClick={() => navigate('/timetable')}>
        Timetable
      </Button>
      <Button color="inherit" onClick={() => navigate('/windows')}>
        Windows
      </Button>
      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </Box>
  );

  const FacultyNav = () => (
    <Box>
      <Button color="inherit" onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
      <Button color="inherit" onClick={() => navigate('/allocations')}>
        My Allocations
      </Button>
      <Button color="inherit" onClick={() => navigate('/timetable')}>
        My Timetable
      </Button>
      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </Box>
  );

  const GuestNav = () => (
    <Box>
      <Button color="inherit" onClick={() => navigate('/login')}>
        Login
      </Button>
      <Button color="inherit" onClick={() => navigate('/register')}>
        Register
      </Button>
    </Box>
  );

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FALO - Faculty Allocation System
        </Typography>
        {isLoggedIn ? (
          user?.role === 'admin' ? (
            <AdminNav />
          ) : (
            <FacultyNav />
          )
        ) : (
          <GuestNav />
        )}
      </Toolbar>
    </AppBar>
  );
}
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WindowIcon from '@mui/icons-material/Window';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout, user }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const AdminNav = () => (
    <Box>
      <Button color="inherit" onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
      <Button color="inherit" onClick={() => navigate('/faculty')}>
        Faculty
      </Button>
      <Button color="inherit" onClick={() => navigate('/courses')}>
        Courses
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
      <Button color="inherit" onClick={() => navigate('/courses')}>
        Courses
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

  const getMenuItems = () => {
    if (!isLoggedIn) {
      return [
        { text: 'Login', icon: <LoginIcon />, action: () => navigate('/login') },
        { text: 'Register', icon: <PersonAddIcon />, action: () => navigate('/register') },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, action: () => navigate('/dashboard') },
        { text: 'Faculty', icon: <PeopleIcon />, action: () => navigate('/faculty') },
        { text: 'Courses', icon: <SchoolIcon />, action: () => navigate('/courses') },
        { text: 'Allocations', icon: <AssignmentIcon />, action: () => navigate('/allocations') },
        { text: 'Timetable', icon: <ScheduleIcon />, action: () => navigate('/timetable') },
        { text: 'Windows', icon: <WindowIcon />, action: () => navigate('/windows') },
        { text: 'Logout', icon: <LogoutIcon />, action: onLogout },
      ];
    }

    return [
      { text: 'Dashboard', icon: <DashboardIcon />, action: () => navigate('/dashboard') },
      { text: 'Courses', icon: <SchoolIcon />, action: () => navigate('/courses') },
      { text: 'My Allocations', icon: <AssignmentIcon />, action: () => navigate('/allocations') },
      { text: 'My Timetable', icon: <ScheduleIcon />, action: () => navigate('/timetable') },
      { text: 'Logout', icon: <LogoutIcon />, action: onLogout },
    ];
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'transparent',
          backdropFilter: 'blur(6px)',
          boxShadow: 'none',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: 'text.primary' }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
            <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
              FALO
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Faculty Allocation System
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

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

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            mt: '64px', // Offset for AppBar
            height: 'calc(100% - 64px)',
            backgroundColor: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', pt: 2 }}>
          {/* User info section */}
          {isLoggedIn && (
            <>
              <Box sx={{ px: 3, py: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role === 'admin' ? 'Administrator' : 'Faculty Member'}
                </Typography>
              </Box>
              <Divider />
            </>
          )}

          {/* Menu items */}
          <List>
            {getMenuItems().map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    item.action();
                    setSidebarOpen(false);
                  }}
                  sx={{
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'primary.lighter',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
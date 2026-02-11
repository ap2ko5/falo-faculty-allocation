import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Paper } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme';
import './App.css';

import Navbar from './components/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import WindowsManager from './components/admin/WindowsManager';

import Login from './pages/Login';
import Register from './pages/Register';
import Allocations from './pages/Allocations';
import Faculty from './pages/Faculty';
import Courses from './pages/Courses';
import Timetable from './pages/Timetable';

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
            <Typography variant="h4" color="error" gutterBottom>
              ⚠️ Application Error
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#d32f2f' }}>
              {this.state.error && this.state.error.toString()}
            </Typography>
            <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#666' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
              Check browser console (F12) for details. Try refreshing the page.
            </Typography>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <div className="App">
              {/* Show Navbar only after login so unauthenticated users see only the login/register pages */}
              {isLoggedIn && (
                <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
              )}
              <main>
              <Routes>
                <Route
                  path="/login"
                  element={
                    !isLoggedIn ? (
                      <Login onLogin={handleLogin} />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    !isLoggedIn ? (
                      <Register />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    isLoggedIn ? (
                      user?.role === 'admin' ? (
                        <AdminDashboard onLogout={handleLogout} user={user} />
                      ) : (
                        <FacultyDashboard onLogout={handleLogout} user={user} />
                      )
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/windows"
                  element={
                    isLoggedIn && user?.role === 'admin' ? (
                      <WindowsManager />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />
                <Route
                  path="/allocations"
                  element={
                    isLoggedIn ? (
                      <Allocations user={user} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/faculty"
                  element={
                    isLoggedIn && user?.role === 'admin' ? (
                      <Faculty />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />
                <Route
                  path="/courses"
                  element={
                    isLoggedIn ? (
                      <Courses />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/timetable"
                  element={
                    isLoggedIn ? (
                      <Timetable user={user} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />
                  }
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
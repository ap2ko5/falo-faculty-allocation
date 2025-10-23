import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    setLoginError('');
    
    try {
      const authenticationResponse = await authService.login(loginCredentials);
      const { token: authToken, user: authenticatedUser } = authenticationResponse;
      
      localStorage.setItem('token', authToken);
      onLogin(authenticatedUser);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.message || 'Login failed. Please try again.';
      setLoginError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login to FALO
          </Typography>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              required
              value={loginCredentials.username}
              onChange={(e) =>
                setLoginCredentials({ ...loginCredentials, username: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              value={loginCredentials.password}
              onChange={(e) =>
                setLoginCredentials({ ...loginCredentials, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/register')}
              >
                Register here
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
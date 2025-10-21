import React from 'react';
import { Box, Container, useTheme } from '@mui/material';

export const AdminBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(245,246,248,0.6), rgba(246,247,249,0.35))'
    }} />
    <div style={{
      position: 'absolute',
      width: 520,
      height: 520,
      right: -120,
      top: -60,
      borderRadius: '50%',
      background: 'rgba(107,114,128,0.04)'
    }} />
  </div>
);

export const FacultyBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(250,250,251,0.6), rgba(247,248,250,0.35))'
    }} />
    <div style={{
      position: 'absolute',
      width: 360,
      height: 360,
      left: -80,
      bottom: -40,
      borderRadius: '50%',
      background: 'rgba(107,114,128,0.03)'
    }} />
  </div>
);

export default function DashboardLayout({ children, role = 'admin' }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 8,
        pb: 6,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {role === 'admin' ? <AdminBackground /> : <FacultyBackground />}
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            boxShadow: '0 6px 20px rgba(22,28,36,0.04)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
import React from 'react';
import { Box, Container, useTheme } from '@mui/material';

export const AdminBackground = () => (
  <svg width="100%" height="100%" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
    <defs>
      <radialGradient id="a" cx="70%" cy="20%" r="90%" fx="60%" fy="10%" gradientTransform="rotate(10)">
        <stop stopColor="#d16ba5" offset="0%"/>
        <stop stopColor="#86a8e7" offset="100%"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#a)"/>
    <circle cx="70" cy="190" r="90" fill="#fcb69f" fillOpacity="0.3"/>
    <ellipse cx="300" cy="90" rx="120" ry="60" fill="#8fd3f4" fillOpacity="0.18"/>
    <ellipse cx="520" cy="350" rx="60" ry="120" fill="#d16ba5" fillOpacity="0.15"/>
  </svg>
);

export const FacultyBackground = () => (
  <svg width="100%" height="100%" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
    <defs>
      <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a8edea"/>
        <stop offset="100%" stopColor="#fed6e3"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#b)" />
    <circle cx="120" cy="80" r="90" fill="#faaca8" fillOpacity="0.25"/>
    <rect x="400" y="220" width="160" height="90" rx="70" fill="#a8edea" fillOpacity="0.15"/>
  </svg>
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: theme.shape.borderRadius,
            p: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[4],
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
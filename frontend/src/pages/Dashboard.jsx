import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Class as ClassIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Faculty Allocations',
      description: 'Manage and view faculty allocations',
      icon: GroupIcon,
      action: () => navigate('/allocations'),
      color: '#1976d2',
    },
    {
      title: 'Timetable',
      description: 'View and manage class timetables',
      icon: ScheduleIcon,
      action: () => navigate('/timetable'),
      color: '#2e7d32',
    },
    {
      title: 'Classes',
      description: 'Manage class information',
      icon: ClassIcon,
      action: () => navigate('/classes'),
      color: '#9c27b0',
    },
    {
      title: 'Departments',
      description: 'View department details',
      icon: SchoolIcon,
      action: () => navigate('/departments'),
      color: '#ed6c02',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  bgcolor: item.color,
                  color: 'white',
                }}
              >
                <item.icon sx={{ fontSize: 40 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={item.action}
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
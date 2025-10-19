import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { timetableService } from '../services/api';

function TimetableView({ data }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            {days.map((day) => (
              <TableCell key={day} align="center">{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {periods.map((period) => (
            <TableRow key={period}>
              <TableCell component="th" scope="row">
                {period}
              </TableCell>
              {days.map((day) => (
                <TableCell key={`${day}-${period}`} align="center">
                  {data.find(
                    (item) => item.day === day && item.time === period
                  )?.course || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Timetable() {
  const [value, setValue] = useState(0);
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [viewType, setViewType] = useState('class'); // 'class' or 'faculty'

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTimetable = async () => {
    if (!selectedId) return;
    
    setLoading(true);
    setError('');
    try {
      let data;
      if (viewType === 'class') {
        data = await timetableService.getByClass(selectedId);
      } else {
        data = await timetableService.getByFaculty(selectedId);
      }
      setTimetableData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchTimetable();
    }
  }, [selectedId, viewType]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Timetable
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Tabs value={value} onChange={handleChange} aria-label="timetable tabs">
          <Tab label="Class Timetable" />
          <Tab label="Faculty Timetable" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>
            {value === 0 ? 'Select Class' : 'Select Faculty'}
          </InputLabel>
          <Select
            value={selectedId}
            label={value === 0 ? 'Select Class' : 'Select Faculty'}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {/* Add options dynamically */}
            <MenuItem value="1">Sample {value === 0 ? 'Class' : 'Faculty'} 1</MenuItem>
            <MenuItem value="2">Sample {value === 0 ? 'Class' : 'Faculty'} 2</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => fetchTimetable()}
          disabled={!selectedId}
        >
          Generate Timetable
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        timetableData.length > 0 && <TimetableView data={timetableData} />
      )}
    </Container>
  );
}
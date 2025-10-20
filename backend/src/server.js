import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import allocationRoutes from './routes/allocations.js';
import timetableRoutes from './routes/timetable.js';
import authRoutes from './routes/auth.js';
import facultyRoutes from './routes/faculty.js';
import courseRoutes from './routes/courses.js';
import reportRoutes from './routes/reports.js';
import { config, initializeDatabase } from './config/database.js';

dotenv.config();

// Initialize database (don't crash if it fails)
initializeDatabase().catch(err => {
  console.error('Database initialization error:', err.message);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'FALO Backend Running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
  console.log(`🚀 FALO Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
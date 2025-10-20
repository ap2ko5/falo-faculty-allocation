import express from 'express';
import timetableController from '../controllers/timetableController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createTimetableSchema } from '../schemas/validation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Faculty and admin routes
router.get('/', timetableController.getAll);
router.get('/class/:class_id', timetableController.getByClass);
router.get('/faculty/:faculty_id', timetableController.getByFaculty);

// Admin only routes
router.use(isAdmin);

router.post('/',
  validateBody(createTimetableSchema),
  timetableController.create
);

router.post('/generate',
  timetableController.generate
);

router.delete('/:id', timetableController.delete);

export default router;
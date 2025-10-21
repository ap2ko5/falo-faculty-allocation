import express from 'express';
import courseController from '../controllers/courseController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCourseSchema, updateCourseSchema } from '../schemas/validation.js';

const router = express.Router();

// Protected routes - all authenticated users can view
router.use(verifyToken);

router.get('/', courseController.getAll);
router.get('/department/:did', courseController.getByDepartment);
router.get('/:id', courseController.getById);

// Admin only routes
router.post('/', 
  isAdmin,
  validateBody(createCourseSchema),
  courseController.create
);
router.put('/:id',
  isAdmin,
  validateBody(updateCourseSchema),
  courseController.update
);
router.delete('/:id', isAdmin, courseController.delete);

export default router;
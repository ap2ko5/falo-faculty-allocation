import express from 'express';
import courseController from '../controllers/courseController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCourseSchema, updateCourseSchema } from '../schemas/validation.js';

const router = express.Router();

// Public routes
router.get('/', courseController.getAll);

// Protected routes
router.use(verifyToken);

// Faculty and admin routes
router.get('/department/:did', courseController.getByDepartment);
router.get('/:id', courseController.getById);

// Admin only routes
router.use(isAdmin);
router.post('/', 
  validateBody(createCourseSchema),
  courseController.create
);
router.put('/:id', 
  validateBody(updateCourseSchema),
  courseController.update
);
router.delete('/:id', courseController.delete);

export default router;
import express from 'express';
import facultyController from '../controllers/facultyController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createFacultySchema, updateFacultySchema } from '../schemas/validation.js';

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Admin only routes
router.use(isAdmin);

router.post('/', 
  validateBody(createFacultySchema),
  facultyController.create
);

router.get('/', facultyController.getAll);
router.get('/:id', facultyController.getById);

router.put('/:id', 
  validateBody(updateFacultySchema),
  facultyController.update
);

router.delete('/:id', facultyController.delete);

router.get('/:id/workload', facultyController.getWorkload);

export default router;

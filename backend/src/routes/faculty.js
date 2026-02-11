import express from 'express';
import facultyController from '../controllers/facultyController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createFacultySchema, updateFacultySchema } from '../schemas/validation.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', facultyController.getAll);
router.get('/:id', facultyController.getById);
router.get('/:id/workload', facultyController.getWorkload);

router.post('/', 
  isAdmin,
  validateBody(createFacultySchema),
  facultyController.create
);

router.put('/:id',
  isAdmin,
  validateBody(updateFacultySchema),
  facultyController.update
);

router.delete('/:id', isAdmin, facultyController.delete);

export default router;

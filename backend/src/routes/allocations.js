import express from 'express';
import allocationController from '../controllers/allocationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createAllocationSchema, autoAllocateSchema } from '../schemas/validation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Faculty and admin routes
router.get('/', allocationController.getAll);
router.get('/windows', allocationController.getWindows);

// Admin only routes
router.use(isAdmin);

router.post('/',
  validateBody(createAllocationSchema),
  allocationController.create
);

router.delete('/:id',
  allocationController.delete
);

router.post('/auto-allocate',
  validateBody(autoAllocateSchema),
  allocationController.autoAllocate
);

export default router;
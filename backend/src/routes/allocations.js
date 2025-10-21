import express from 'express';
import allocationController from '../controllers/allocationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createAllocationSchema, autoAllocateSchema } from '../schemas/validation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Faculty and admin routes - anyone can view and create (faculty creates with status='pending')
router.get('/', allocationController.getAll);
router.get('/windows', allocationController.getWindows);
router.post('/',
  validateBody(createAllocationSchema),
  allocationController.create
);

// Admin only routes
router.use(isAdmin);

router.put('/:id/approve',
  allocationController.approve
);

router.put('/:id/reject',
  allocationController.reject
);

router.delete('/:id',
  allocationController.delete
);

router.post('/auto-allocate',
  validateBody(autoAllocateSchema),
  allocationController.autoAllocate
);

export default router;
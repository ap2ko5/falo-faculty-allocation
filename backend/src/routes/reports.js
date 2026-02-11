import express from 'express';
import reportsController from '../controllers/reportsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/allocation-stats',
  reportsController.getAllocationStats
);

router.get('/faculty-workload',
  reportsController.getFacultyWorkload
);

router.get('/department',
  reportsController.getDepartmentReport
);

router.get('/courses',
  reportsController.getCourseReport
);

export default router;
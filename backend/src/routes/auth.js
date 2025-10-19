import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/faculty/login', authController.facultyLogin);
router.post('/admin/login', authController.adminLogin);

export default router;
import express from 'express';
import authController from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { loginSchema, registerSchema } from '../schemas/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login',
  validateBody(loginSchema),
  authController.login
);

router.post('/register',
  validateBody(registerSchema),
  authController.register
);

router.get('/profile',
  verifyToken,
  authController.profile
);

export default router;
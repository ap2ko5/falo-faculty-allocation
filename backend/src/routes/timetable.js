import express from 'express';
import { timetableController } from '../controllers/timetableController.js';

const router = express.Router();

router.get('/', timetableController.getAll);
router.get('/class/:ClID', timetableController.getByClass);
router.get('/faculty/:FID', timetableController.getByFaculty);
router.post('/generate', timetableController.generate);
router.delete('/:id', timetableController.delete);

export default router;
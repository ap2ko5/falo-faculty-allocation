import express from 'express';
import { allocationController } from '../controllers/allocationController.js';

const router = express.Router();

router.get('/', allocationController.getAll);
router.post('/', allocationController.create);
router.delete('/:id', allocationController.delete);
router.post('/auto-allocate', allocationController.autoAllocate);
router.get('/windows', allocationController.getWindows);
router.post('/windows/:windowID/close', allocationController.closeWindow);

export default router;
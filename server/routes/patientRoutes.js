import express from 'express';
import {
  getAllPatients,
  getPatientById,
  togglePatientStatus,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, authorizeRoles('admin', 'doctor'), getPatientById);
router.put('/:id/toggle-status', protect, authorizeRoles('admin'), togglePatientStatus);

export default router;

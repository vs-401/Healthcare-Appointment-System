import express from 'express';
import {
  createMedicalRecord,
  getRecordsByPatient,
  getRecordById,
} from '../controllers/medicalRecordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('doctor', 'admin'), createMedicalRecord);
router.get('/patient/:patientId', protect, getRecordsByPatient);
router.get('/:id', protect, getRecordById);

export default router;

import express from 'express';
import {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionById,
  getPrescriptionByAppointment,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('doctor', 'admin'), createPrescription);
router.get('/patient/:patientId', protect, getPrescriptionsByPatient);
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);
router.get('/:id', protect, getPrescriptionById);

export default router;

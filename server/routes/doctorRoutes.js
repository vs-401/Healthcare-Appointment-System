import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorAvailability,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorizeRoles('admin'), createDoctor);
router.put('/:id', protect, authorizeRoles('admin', 'doctor'), updateDoctor);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDoctor);
router.put('/:id/availability', protect, authorizeRoles('admin', 'doctor'), updateDoctorAvailability);

export default router;

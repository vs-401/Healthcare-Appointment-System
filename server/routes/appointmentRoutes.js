import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/patient/my-appointments', protect, authorizeRoles('patient', 'admin'), getPatientAppointments);
router.get('/doctor/my-appointments', protect, authorizeRoles('doctor', 'admin'), getDoctorAppointments);
router.get('/', protect, authorizeRoles('admin'), getAllAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, authorizeRoles('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/reschedule', protect, rescheduleAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

export default router;

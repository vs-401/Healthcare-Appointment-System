import express from 'express';
import {
  submitContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', protect, authorizeRoles('admin'), getAllContactMessages);
router.put('/:id', protect, authorizeRoles('admin'), updateMessageStatus);
router.delete('/:id', protect, authorizeRoles('admin'), deleteContactMessage);

export default router;

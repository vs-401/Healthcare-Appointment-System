import express from 'express';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', protect, authorizeRoles('admin'), createDepartment);
router.put('/:id', protect, authorizeRoles('admin'), updateDepartment);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDepartment);

export default router;

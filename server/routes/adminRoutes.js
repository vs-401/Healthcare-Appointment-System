import express from 'express';
import { getDashboardStats, getAnalyticsData } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalyticsData);

export default router;

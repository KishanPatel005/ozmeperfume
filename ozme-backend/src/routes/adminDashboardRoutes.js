import express from 'express';
import { getAdminDashboardSummary } from '../controllers/adminDashboardController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

router.get('/summary', getAdminDashboardSummary);

export default router;


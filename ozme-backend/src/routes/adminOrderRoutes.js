import express from 'express';
import {
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
} from '../controllers/adminOrderController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

const statusValidation = [
  body('orderStatus').optional().isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  body('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed', 'Refunded']),
  body('trackingNumber').optional().isString(),
];

router.get('/', getAdminOrders);
router.get('/:id', getAdminOrder);
router.patch('/:id/status', statusValidation, validateRequest, updateAdminOrderStatus);

export default router;


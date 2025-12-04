import express from 'express';
import {
  createOrder,
  getOrder,
  getUserOrders,
  trackOrder,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

const createOrderValidation = [
  body('shippingAddress.name').notEmpty().withMessage('Name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').optional().isIn(['COD', 'Prepaid']).withMessage('Invalid payment method'),
];

router.post('/', protect, createOrderValidation, validateRequest, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/track/:identifier', optionalAuth, trackOrder);
router.get('/:id', optionalAuth, getOrder);

export default router;


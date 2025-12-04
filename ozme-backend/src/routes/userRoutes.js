import express from 'express';
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile update validation
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
];

// Address validation
const addressValidation = [
  body('type').isIn(['Home', 'Office', 'Other']).withMessage('Invalid address type'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required'),
];

// Routes
router.put('/me', updateProfileValidation, validateRequest, updateProfile);
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', addressValidation, validateRequest, addAddress);
router.put('/me/addresses/:addressId', addressValidation, validateRequest, updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);

export default router;


import express from 'express';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../controllers/adminProductController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('images').isArray().withMessage('Images must be an array'),
  body('category').isIn(['Oriental', 'Floral', 'Woody', 'Fresh', 'Limited Edition']).withMessage('Invalid category'),
  body('gender').isIn(['Men', 'Women', 'Unisex']).withMessage('Invalid gender'),
];

router.get('/', getAdminProducts);
router.post('/', productValidation, validateRequest, createAdminProduct);
router.put('/:id', productValidation, validateRequest, updateAdminProduct);
router.delete('/:id', deleteAdminProduct);

export default router;


import express from 'express';
import multer from 'multer';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImages,
} from '../controllers/adminProductController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminProtect);

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.get('/', getAdminProducts);
router.post('/upload-images', upload.array('images', 10), uploadProductImages); // Keep for backward compatibility if needed
router.post('/', upload.array('images', 10), createAdminProduct);
router.put('/:id', upload.array('images', 10), updateAdminProduct);
router.delete('/:id', deleteAdminProduct);

export default router;


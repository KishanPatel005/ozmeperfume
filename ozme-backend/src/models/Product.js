import mongoose from 'mongoose';

/**
 * Product Schema
 * @typedef {Object} Product
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {number} originalPrice - Original price (for discounts)
 * @property {string[]} images - Array of image URLs
 * @property {string} category - Product category
 * @property {string} gender - Target gender (Men/Women/Unisex)
 * @property {string} size - Product size (default: 100ml)
 * @property {number} rating - Average rating
 * @property {number} reviewsCount - Number of reviews
 * @property {string} tag - Product tag (Bestseller/New/Limited)
 * @property {boolean} inStock - Stock availability
 * @property {number} stockQuantity - Available stock quantity
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Oriental', 'Floral', 'Woody', 'Fresh', 'Limited Edition'],
    },
    gender: {
      type: String,
      required: [true, 'Product gender is required'],
      enum: ['Men', 'Women', 'Unisex'],
    },
    size: {
      type: String,
      default: '100ml',
      enum: ['100ml'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      enum: ['Bestseller', 'New', 'Limited'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    marketplace: {
      amazon: {
        type: Boolean,
        default: false,
      },
      flipkart: {
        type: Boolean,
        default: false,
      },
      myntra: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, gender: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;


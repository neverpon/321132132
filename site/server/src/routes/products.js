const express = require('express');
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.use(protect);

router.post(
  '/',
  restrictTo('admin'),
  validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Product category is required'),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required'),
    
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Price cannot be negative'),
    
    body('details')
      .optional()
      .isObject()
      .withMessage('Details must be an object')
  ]),
  createProduct
);

router.put(
  '/:id',
  restrictTo('admin'),
  validate([
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Price cannot be negative'),
    
    body('details')
      .optional()
      .isObject()
      .withMessage('Details must be an object')
  ]),
  updateProduct
);

router.delete('/:id', restrictTo('admin'), deleteProduct);

module.exports = router;
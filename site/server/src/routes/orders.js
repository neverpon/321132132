const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

router.get('/', getUserOrders);

router.get('/:id', getOrderById);

router.post(
  '/',
  validate([
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    body('items.*.productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    
    body('items.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required'),
    
    body('billingAddress')
      .optional()
      .isObject()
      .withMessage('Billing address must be an object')
  ]),
  createOrder
);

router.put('/:id/cancel', cancelOrder);

module.exports = router;
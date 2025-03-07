const express = require('express');
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');
const { updateOrderStatus } = require('../controllers/orderController');
const {
  getUserStats,
  getOrderStats,
  getAllUsers
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats/users', getUserStats);
router.get('/stats/orders', getOrderStats);

router.get('/users', getAllUsers);

router.put(
  '/orders/:id',
  validate([
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['pending', 'processing', 'completed', 'cancelled'])
      .withMessage('Invalid status value')
  ]),
  updateOrderStatus
);

module.exports = router;
const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');
const {
  getCurrentUser,
  updateUserProfile,
  changePassword
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/me', getCurrentUser);

router.put(
  '/me',
  validate([
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address')
  ]),
  updateUserProfile
);

router.put(
  '/me/password',
  validate([
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
  ]),
  changePassword
);

module.exports = router;
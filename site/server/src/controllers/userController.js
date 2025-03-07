const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return errorResponse(res, 404, 'NOT_FOUND', 'User not found');
    }
    
    successResponse(res, 200, {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    logger.error('Error getting current user:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get user information');
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Email is already in use');
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return errorResponse(res, 404, 'NOT_FOUND', 'User not found');
    }
    
    successResponse(res, 200, {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to update user profile');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return errorResponse(res, 404, 'NOT_FOUND', 'User not found');
    }
    
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    
    if (!isPasswordCorrect) {
      return errorResponse(res, 401, 'INVALID_CREDENTIALS', 'Current password is incorrect');
    }
    
    user.password = newPassword;
    await user.save();
    
    successResponse(res, 200, { message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Error changing password:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to change password');
  }
};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

const generateRefreshToken = async (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const expirySeconds = parseInt(expiresIn) || 7 * 24 * 60 * 60; // Default 7 days
  const expiresAt = new Date(Date.now() + expirySeconds * 1000);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt
  });

  return token;
};

const setCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Email is already registered');
    }

    const newUser = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(newUser._id);
    const refreshToken = await generateRefreshToken(newUser._id);

    setCookie(res, token);

    successResponse(res, 201, {
      token,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'An error occurred during registration');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (user.isAccountLocked()) {
      return errorResponse(res, 401, 'ACCOUNT_LOCKED', 'Account locked due to multiple failed login attempts. Try again later.');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= 5) {
        user.accountLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        
        return errorResponse(res, 401, 'ACCOUNT_LOCKED', 'Account locked due to multiple failed login attempts. Try again later.');
      }
      
      await user.save();
      
      return errorResponse(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    user.loginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    setCookie(res, token);

    successResponse(res, 200, {
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'An error occurred during login');
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 400, 'INVALID_REQUEST', 'Refresh token is required');
    }

    const storedToken = await RefreshToken.findOne({ 
      token: refreshToken,
      expiresAt: { $gt: new Date() } 
    });

    if (!storedToken) {
      return errorResponse(res, 401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'INVALID_TOKEN', 'User not found');
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id);

    await RefreshToken.findByIdAndDelete(storedToken._id);

    setCookie(res, newToken);

    successResponse(res, 200, {
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    logger.error('Token refresh error:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'An error occurred during token refresh');
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    successResponse(res, 200, { message: 'Successfully logged out' });
  } catch (error) {
    logger.error('Logout error:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'An error occurred during logout');
  }
};
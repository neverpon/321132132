const User = require('../models/User');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

exports.getUserStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const startOfQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
    
    const totalUsers = await User.countDocuments();
    
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });
    
    const lastMonthGrowth = usersLastMonth > 0 
      ? ((newUsersThisMonth / usersLastMonth) * 100).toFixed(1)
      : 100;
    
    const usersLastQuarter = await User.countDocuments({
      createdAt: { $gte: startOfQuarter }
    });
    
    const lastQuarterGrowth = usersLastQuarter > 0
      ? ((totalUsers / usersLastQuarter - 1) * 100).toFixed(1)
      : 100;
    
    successResponse(res, 200, {
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      userGrowth: {
        lastMonth: parseFloat(lastMonthGrowth),
        lastQuarter: parseFloat(lastQuarterGrowth)
      }
    });
  } catch (error) {
    logger.error('Error getting user statistics:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get user statistics');
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const totalOrders = await Order.countDocuments();
    
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    
    const ordersThisWeek = await Order.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
    
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    const allOrders = await Order.find();
    
    const totalRevenue = allOrders.reduce((total, order) => total + order.total, 0);
    
    const ordersFromToday = await Order.find({
      createdAt: { $gte: startOfToday }
    });
    const revenueToday = ordersFromToday.reduce((total, order) => total + order.total, 0);
    
    const ordersFromThisWeek = await Order.find({
      createdAt: { $gte: startOfWeek }
    });
    const revenueThisWeek = ordersFromThisWeek.reduce((total, order) => total + order.total, 0);
    
    const ordersFromThisMonth = await Order.find({
      createdAt: { $gte: startOfMonth }
    });
    const revenueThisMonth = ordersFromThisMonth.reduce((total, order) => total + order.total, 0);
    
    successResponse(res, 200, {
      totalOrders,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      totalRevenue,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth
    });
  } catch (error) {
    logger.error('Error getting order statistics:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get order statistics');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    
    const searchQuery = {};
    if (req.query.search) {
      searchQuery.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(searchQuery)
    ]);
    
    const enhancedUsers = await Promise.all(users.map(async (user) => {
      const ordersCount = await Order.countDocuments({ user: user._id });
      const orders = await Order.find({ user: user._id });
      const totalSpent = orders.reduce((total, order) => total + order.total, 0);
      
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.role === 'admin',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        ordersCount,
        totalSpent
      };
    }));
    
    const pages = Math.ceil(total / limit);
    
    successResponse(res, 200, {
      users: enhancedUsers,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    logger.error('Error getting all users:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get users');
  }
};
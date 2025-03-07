const Order = require('../models/Order');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, paymentDetails, billingAddress } = req.body;
    
    if (!items || !items.length) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Order must contain at least one item');
    }
    
    const orderItems = [];
    let total = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', `Product with ID ${item.productId} not found`);
      }
      
      if (!product.isActive) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', `Product ${product.name} is no longer available`);
      }
      
      const quantity = item.quantity || 1;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
      
      total += product.price * quantity;
    }
    
    const newOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      status: 'processing',
      paymentMethod,
      paymentDetails,
      billingAddress
    });
    
    await newOrder.populate('user', 'username email');
    
    successResponse(res, 201, newOrder);
  } catch (error) {
    logger.error('Error creating order:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to create order');
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { user: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);
    
    const pages = Math.ceil(total / limit);
    
    successResponse(res, 200, {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    logger.error('Error getting user orders:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get orders');
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Order not found');
    }
    
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to view this order');
    }
    
    successResponse(res, 200, order);
  } catch (error) {
    logger.error(`Error getting order with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get order');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Status is required');
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Order not found');
    }
    
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to update this order');
    }
    
    order.status = status;
    await order.save();
    
    successResponse(res, 200, order);
  } catch (error) {
    logger.error(`Error updating order status with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to update order status');
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Order not found');
    }
    
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to cancel this order');
    }
    
    if (order.status === 'completed') {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Completed orders cannot be cancelled');
    }
    
    if (order.status === 'cancelled') {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Order is already cancelled');
    }
    
    order.status = 'cancelled';
    await order.save();
    
    successResponse(res, 200, order);
  } catch (error) {
    logger.error(`Error cancelling order with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to cancel order');
  }
};
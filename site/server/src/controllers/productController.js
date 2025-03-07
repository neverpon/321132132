const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

exports.getAllProducts = async (req, res) => {
  try {
    const queryObj = { isActive: true };
    
    if (req.query.category) {
      queryObj.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }
    
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }
    
    let query = Product.find(queryObj);
    
    if (req.query.sort && req.query.order) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [sortField]: sortOrder });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const [products, total] = await Promise.all([
      query,
      Product.countDocuments(queryObj)
    ]);
    
    const pages = Math.ceil(total / limit);
    
    successResponse(res, 200, {
      products,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    logger.error('Error getting products:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get products');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'username');
    
    if (!product) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Product not found');
    }
    
    successResponse(res, 200, product);
  } catch (error) {
    logger.error(`Error getting product with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get product');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, price, details } = req.body;
    
    const newProduct = await Product.create({
      name,
      category,
      description,
      price,
      details,
      createdBy: req.user._id
    });
    
    successResponse(res, 201, newProduct);
  } catch (error) {
    logger.error('Error creating product:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to create product');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Product not found');
    }
    
    if (req.user.role !== 'admin' && product.createdBy?.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to update this product');
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    successResponse(res, 200, updatedProduct);
  } catch (error) {
    logger.error(`Error updating product with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to update product');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return errorResponse(res, 404, 'NOT_FOUND', 'Product not found');
    }
    
    if (req.user.role !== 'admin' && product.createdBy?.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to delete this product');
    }
    
    product.isActive = false;
    await product.save();
    
    successResponse(res, 200, { message: 'Product deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting product with ID ${req.params.id}:`, error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to delete product');
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    const formattedCategories = categories.map(category => ({
      name: category,
      value: category.toLowerCase().replace(/\s+/g, '-')
    }));
    
    successResponse(res, 200, { categories: formattedCategories });
  } catch (error) {
    logger.error('Error getting product categories:', error);
    errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Failed to get product categories');
  }
};
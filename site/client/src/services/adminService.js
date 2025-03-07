import api, { getCsrfToken } from './api';

// Dashboard Statistics
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};

// Product Management
export const getAllProductsAdmin = async (params = {}) => {
  try {
    const response = await api.get('/admin/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin products:', error);
    throw error;
  }
};

export const createProductAdmin = async (productData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.post(
      '/admin/products', 
      productData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProductAdmin = async (id, productData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/admin/products/${id}`, 
      productData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProductAdmin = async (id) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.delete(
      `/admin/products/${id}`,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

// Order Management
export const getAllOrdersAdmin = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
};

export const getOrderDetailsAdmin = async (id) => {
  try {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order details with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderAdmin = async (id, orderData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/admin/orders/${id}`, 
      orderData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
};

// User Management
export const getAllUsersAdmin = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const getUserDetailsAdmin = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details with id ${id}:`, error);
    throw error;
  }
};

export const updateUserAdmin = async (id, userData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/admin/users/${id}`, 
      userData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const deleteUserAdmin = async (id) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.delete(
      `/admin/users/${id}`,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

// Category Management
export const getAllCategoriesAdmin = async () => {
  try {
    const response = await api.get('/admin/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategoryAdmin = async (categoryData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.post(
      '/admin/categories', 
      categoryData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategoryAdmin = async (id, categoryData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/admin/categories/${id}`, 
      categoryData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategoryAdmin = async (id) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.delete(
      `/admin/categories/${id}`,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};

export default {
  getAdminDashboardStats,
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAllOrdersAdmin,
  getOrderDetailsAdmin,
  updateOrderAdmin,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getAllCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin
};
import api, { getCsrfToken } from './api';

export const createOrder = async (orderData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.post(
      '/orders', 
      orderData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/admin/orders/${id}`,
      { status },
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating order status with id ${id}:`, error);
    throw error;
  }
};

export const cancelOrder = async (id) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/orders/${id}/cancel`,
      {},
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error cancelling order with id ${id}:`, error);
    throw error;
  }
};
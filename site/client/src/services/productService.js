import api, { getCsrfToken } from './api';

export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.post(
      '/products', 
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

export const updateProduct = async (id, productData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      `/products/${id}`, 
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

export const deleteProduct = async (id) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.delete(
      `/products/${id}`,
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

export const getProductCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};
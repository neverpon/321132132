import api, { getCsrfToken } from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const logout = async (refreshToken) => {
  try {
    const csrfToken = await getCsrfToken();
    
    await api.post('/auth/logout', 
      { refreshToken },
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const csrfToken = await getCsrfToken();
    
    const response = await api.put(
      '/users/me/password',
      passwordData,
      { 
        headers: { 'X-CSRF-Token': csrfToken }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, register, refreshToken, logout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshTokenValue = localStorage.getItem('refreshToken');
      
      if (!token || !refreshTokenValue) {
        setLoading(false);
        return;
      }
      
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          const response = await refreshToken(refreshTokenValue);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          setCurrentUser(jwtDecode(response.token));
        } else {
          setCurrentUser(decodedToken);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logoutUser = async () => {
    setLoading(true);
    
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      await logout(refreshTokenValue);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        error, 
        loginUser, 
        registerUser, 
        logoutUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
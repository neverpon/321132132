import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, register, refreshToken, logout } from '../services/authService';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState(null);
  const { error: showToastError } = useToast ? useToast() : { error: () => {} };

  const startTokenRefreshTimer = useCallback((expirationTime) => {
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
    }

    const timeUntilExpiry = expirationTime * 1000 - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 10000);
    
    const intervalId = setInterval(async () => {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        try {
          const response = await refreshToken(refreshTokenValue);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          const decoded = jwtDecode(response.token);
          setTokenExpiration(decoded.exp);
          startTokenRefreshTimer(decoded.exp);
        } catch (err) {
          console.error('Auto token refresh failed:', err);
          clearInterval(intervalId);
          setTokenRefreshInterval(null);
        }
      } else {
        clearInterval(intervalId);
        setTokenRefreshInterval(null);
      }
    }, refreshTime);
    
    setTokenRefreshInterval(intervalId);
  }, [tokenRefreshInterval]);

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
          try {
            const response = await refreshToken(refreshTokenValue);
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            const newDecodedToken = jwtDecode(response.token);
            setCurrentUser(newDecodedToken);
            setTokenExpiration(newDecodedToken.exp);
            startTokenRefreshTimer(newDecodedToken.exp);
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        } else {
          setCurrentUser(decodedToken);
          setTokenExpiration(decodedToken.exp);
          startTokenRefreshTimer(decodedToken.exp);
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
    
    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [startTokenRefreshTimer]);
  
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'refreshToken') {
        if (!e.newValue) {
          setCurrentUser(null);
          if (tokenRefreshInterval) {
            clearInterval(tokenRefreshInterval);
            setTokenRefreshInterval(null);
          }
        } else if (e.key === 'token' && e.newValue !== localStorage.getItem('token')) {
          try {
            const decodedToken = jwtDecode(e.newValue);
            setCurrentUser(decodedToken);
            setTokenExpiration(decodedToken.exp);
            startTokenRefreshTimer(decodedToken.exp);
          } catch (err) {
            console.error('Error processing token from storage event:', err);
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [tokenRefreshInterval, startTokenRefreshTimer]);

  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setCurrentUser(response.user);
      
      if (response.token) {
        const decodedToken = jwtDecode(response.token);
        setTokenExpiration(decodedToken.exp);
        startTokenRefreshTimer(decodedToken.exp);
      }
      
      return response.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to login';
      setError(errorMessage);
      showToastError(errorMessage);
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
      
      if (response.token) {
        const decodedToken = jwtDecode(response.token);
        setTokenExpiration(decodedToken.exp);
        startTokenRefreshTimer(decodedToken.exp);
      }
      
      return response.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to register';
      setError(errorMessage);
      showToastError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logoutUser = async () => {
    setLoading(true);
    
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      
      if (refreshTokenValue) {
        await logout(refreshTokenValue);
      }
      
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        setTokenRefreshInterval(null);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
}
import React, { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ui/Toast';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type, duration }
    ]);
    
    return id;
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);
  
  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);
  
  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);
  
  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);
  
  return (
    <ToastContext.Provider 
      value={{ 
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
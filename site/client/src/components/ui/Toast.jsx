import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration);
    
    return () => clearTimeout(timeout);
  }, [toast, onRemove]);
  
  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-white" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };
  
  const getToastBackground = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600';
      case 'error':
        return 'bg-red-500 dark:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 dark:bg-blue-600';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`max-w-sm rounded-lg shadow-lg overflow-hidden ${getToastBackground()} pointer-events-auto`}
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          {getToastIcon()}
        </div>
        <div className="flex-1 text-white">
          {toast.message}
        </div>
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={() => onRemove(toast.id)}
            className="text-white hover:text-white/80 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="h-1 bg-white/20">
        <div 
          className="h-1 bg-white/40"
          style={{ 
            width: '100%',
            animation: `shrinkWidth ${toast.duration}ms linear forwards`
          }}
        />
      </div>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
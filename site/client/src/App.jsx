import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import News from './pages/News';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Rendering error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg m-4">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Something went wrong</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Refresh Page
          </button>
          <details className="mt-4 p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <summary className="cursor-pointer text-red-800 dark:text-red-300 font-medium">Error details</summary>
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded overflow-auto max-h-60 text-sm">
              <p className="font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </p>
              <p className="font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-2">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </p>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isRouterMounted, setIsRouterMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Application initialized");
    
    console.log("React Router available:", !!Router);
    console.log("React available:", !!React);
    
    setTimeout(() => {
      setIsRouterMounted(true);
      setIsLoading(false);
    }, 100);

    const handleError = (event) => {
      console.error("Global JavaScript error:", event.error);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      console.log("Application unmounted");
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {isRouterMounted ? (
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <ToastProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Layout />
                      </ErrorBoundary>
                    }>
                      <Route index element={
                        <ErrorBoundary>
                          <Home />
                        </ErrorBoundary>
                      } />
                      <Route path="products" element={
                        <ErrorBoundary>
                          <Products />
                        </ErrorBoundary>
                      } />
                      <Route path="products/:id" element={
                        <ErrorBoundary>
                          <ProductDetail />
                        </ErrorBoundary>
                      } />
                      <Route path="news" element={
                        <ErrorBoundary>
                          <News />
                        </ErrorBoundary>
                      } />
                      <Route path="contact" element={
                        <ErrorBoundary>
                          <Contact />
                        </ErrorBoundary>
                      } />
                      <Route path="cart" element={
                        <ErrorBoundary>
                          <Cart />
                        </ErrorBoundary>
                      } />
                      <Route path="login" element={
                        <ErrorBoundary>
                          <Login />
                        </ErrorBoundary>
                      } />
                      <Route path="register" element={
                        <ErrorBoundary>
                          <Register />
                        </ErrorBoundary>
                      } />
                      
                      {/* Protected routes */}
                      <Route element={
                        <ErrorBoundary>
                          <ProtectedRoute />
                        </ErrorBoundary>
                      }>
                        <Route path="checkout" element={
                          <ErrorBoundary>
                            <Checkout />
                          </ErrorBoundary>
                        } />
                        <Route path="account/*" element={
                          <ErrorBoundary>
                            <Account />
                          </ErrorBoundary>
                        } />
                      </Route>
                    </Route>
                    
                    {/* Admin routes */}
                    <Route 
                      path="admin" 
                      element={
                        <ErrorBoundary>
                          <ProtectedRoute requiredRole="admin">
                            <AdminLayout />
                          </ProtectedRoute>
                        </ErrorBoundary>
                      }
                    >
                      <Route index element={
                        <ErrorBoundary>
                          <AdminDashboard />
                        </ErrorBoundary>
                      } />
                      <Route path="products" element={
                        <ErrorBoundary>
                          <AdminProducts />
                        </ErrorBoundary>
                      } />
                      <Route path="orders" element={
                        <ErrorBoundary>
                          <AdminOrders />
                        </ErrorBoundary>
                      } />
                      <Route path="users" element={
                        <ErrorBoundary>
                          <AdminUsers />
                        </ErrorBoundary>
                      } />
                    </Route>
                  </Routes>
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      ) : (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          Error initializing router. Please refresh the page.
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;
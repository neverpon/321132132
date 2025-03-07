import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
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

// Компонент ErrorBoundary для отлова ошибок рендеринга
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка рендеринга:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px' }}>
          <h2>Что-то пошло не так</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Подробности ошибки</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Компонент для отладки загрузки контекстов
const DebugProvider = ({ context: Context, children, name }) => {
  useEffect(() => {
    console.log(`${name} контекст загружен`);
    return () => console.log(`${name} контекст размонтирован`);
  }, [name]);

  return <Context>{children}</Context>;
};

function App() {
  const [isRouterMounted, setIsRouterMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Логирование монтирования приложения
  useEffect(() => {
    console.log("Приложение инициализировано");
    
    // Проверка доступности ключевых зависимостей
    console.log("React Router доступен:", !!Router);
    console.log("React доступен:", !!React);
    
    // Имитация задержки для проверки загрузки
    setTimeout(() => {
      setIsRouterMounted(true);
      setIsLoading(false);
      console.log("Монтирование роутера после проверки");
    }, 100);

    // Добавляем обработчик для отслеживания ошибок JavaScript
    const handleError = (event) => {
      console.error("Глобальная ошибка JavaScript:", event.error);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      console.log("Приложение размонтировано");
    };
  }, []);

  // Отображение состояния загрузки
  if (isLoading) {
    return <div style={{ padding: '20px' }}>Загрузка приложения...</div>;
  }

  return (
    <ErrorBoundary>
      {isRouterMounted ? (
        <Router>
          <DebugProvider context={AuthProvider} name="Auth">
            <DebugProvider context={CartProvider} name="Cart">
              <DebugProvider context={ToastProvider} name="Toast">
                <div id="app-debug-container">
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
                </div>
              </DebugProvider>
            </DebugProvider>
          </DebugProvider>
        </Router>
      ) : (
        <div>Ошибка инициализации роутера</div>
      )}
    </ErrorBoundary>
  );
}

export default App;
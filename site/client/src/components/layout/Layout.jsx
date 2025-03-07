import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import { useCart } from '../../hooks/useCart';

const Layout = () => {
  const { cartOpen } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {cartOpen && <CartSidebar />}
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Calculate total including estimated taxes
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Helmet>
          <title>Your Cart | AI Butik</title>
        </Helmet>
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any neural networks to your cart yet.</p>
          <Link to="/products" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition">
            <ArrowLeft size={18} className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Your Cart | AI Butik</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-primary-light/20 flex items-center justify-center text-primary font-semibold">
                        AI
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to={`/products/${item.id}`} className="hover:text-primary">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border rounded-lg">
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-l-lg"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                } else {
                                  removeFromCart(item.id);
                                }
                              }}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-r-lg"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="flex">
                            <button 
                              type="button" 
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={16} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  className="text-primary hover:text-primary-dark flex items-center"
                  onClick={() => clearCart()}
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear Cart
                </button>
                
                <Link
                  to="/products"
                  className="text-primary hover:text-primary-dark flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {isAuthenticated ? (
                <Link 
                  to="/checkout"
                  className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    state={{ from: '/checkout' }}
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition flex items-center justify-center"
                  >
                    Login to Checkout
                  </Link>
                  <p className="text-sm text-gray-500 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">We Accept</h3>
              <div className="flex space-x-2">
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <p className="mb-2">Need help? Contact our support team:</p>
                <p>
                  <a href="mailto:support@aibutik.com" className="text-primary hover:underline">
                    support@aibutik.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
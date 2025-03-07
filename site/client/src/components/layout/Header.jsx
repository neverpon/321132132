import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, isAuthenticated, logoutUser } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Support: info@aibutik.com</span>
            <span className="text-sm">|</span>
            <span className="text-sm">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm hover:text-primary-light transition">Help Center</a>
            <a href="#" className="text-sm hover:text-primary-light transition">Track Order</a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center">
              <span className="mr-2 text-3xl">🧠</span>
              AI Butik
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for AI models..." 
                className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <Heart size={22} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
            
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={toggleCart}
            >
              <ShoppingCart size={22} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{totalItems}</span>
            </button>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hidden md:flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition">
                  <User size={22} className="text-gray-600" />
                  <span className="text-gray-700">{currentUser.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block z-10">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">My Account</Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">My Orders</Link>
                  {currentUser.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">Admin Panel</Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={logoutUser}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm text-primary hover:bg-primary-light/10 rounded-lg transition">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition">Register</Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
            </button>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="hidden md:flex mt-4 border-t pt-3">
          <nav className="w-full">
            <ul className="flex space-x-8">
              <li><Link to="/" className="text-primary font-medium">Home</Link></li>
              <li className="relative group">
                <Link to="/products" className="flex items-center text-gray-700 hover:text-primary transition">
                  Categories
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block z-10">
                  <Link to="/products?category=computer-vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">Computer Vision</Link>
                  <Link to="/products?category=natural-language" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">Natural Language</Link>
                  <Link to="/products?category=audio-processing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">Audio Processing</Link>
                  <Link to="/products?category=forecasting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 rounded">Forecasting</Link>
                </div>
              </li>
              <li><Link to="/products" className="text-gray-700 hover:text-primary transition">Products</Link></li>
              <li><Link to="/news" className="text-gray-700 hover:text-primary transition">News</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-primary transition">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 border-t">
          <div className="mb-4">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search for AI models..." 
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          <nav>
            <ul className="space-y-2">
              <li><Link to="/" className="block p-2 rounded text-primary font-medium">Home</Link></li>
              <li><Link to="/products" className="block p-2 rounded text-gray-700 hover:bg-gray-100">Products</Link></li>
              <li><Link to="/products?category=computer-vision" className="block p-2 pl-4 rounded text-gray-600 hover:bg-gray-100">Computer Vision</Link></li>
              <li><Link to="/products?category=natural-language" className="block p-2 pl-4 rounded text-gray-600 hover:bg-gray-100">Natural Language</Link></li>
              <li><Link to="/products?category=audio-processing" className="block p-2 pl-4 rounded text-gray-600 hover:bg-gray-100">Audio Processing</Link></li>
              <li><Link to="/products?category=forecasting" className="block p-2 pl-4 rounded text-gray-600 hover:bg-gray-100">Forecasting</Link></li>
              <li><Link to="/news" className="block p-2 rounded text-gray-700 hover:bg-gray-100">News</Link></li>
              <li><Link to="/contact" className="block p-2 rounded text-gray-700 hover:bg-gray-100">Contact</Link></li>
              <li><hr className="my-2" /></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/account" className="block p-2 rounded text-gray-700 hover:bg-gray-100">My Account</Link></li>
                  <li><Link to="/account/orders" className="block p-2 rounded text-gray-700 hover:bg-gray-100">My Orders</Link></li>
                  {currentUser.isAdmin && (
                    <li><Link to="/admin" className="block p-2 rounded text-gray-700 hover:bg-gray-100">Admin Panel</Link></li>
                  )}
                  <li>
                    <button
                      onClick={logoutUser}
                      className="block w-full text-left p-2 rounded text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="block p-2 rounded text-gray-700 hover:bg-gray-100">Login</Link></li>
                  <li><Link to="/register" className="block p-2 rounded text-gray-700 hover:bg-gray-100">Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
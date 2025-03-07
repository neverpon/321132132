import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, logoutUser } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset search and close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };
  
  // Categories
  const categories = [
    { name: 'Computer Vision', slug: 'computer-vision' },
    { name: 'Natural Language', slug: 'natural-language' },
    { name: 'Audio Processing', slug: 'audio-processing' },
    { name: 'Forecasting', slug: 'forecasting' }
  ];
  
  return (
    <header className="bg-white dark:bg-dark-bg shadow-md transition-colors duration-300">
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
            <ThemeToggle />
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
                className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-200 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Heart size={22} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
            
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleCart}
            >
              <ShoppingCart size={22} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{totalItems}</span>
            </button>
            
            {isAuthenticated ? (
              <div className="relative group" ref={userDropdownRef}>
                <button 
                  className="hidden md:flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={toggleUserDropdown}
                >
                  <User size={22} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">{currentUser.username}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card shadow-lg rounded-lg p-2 z-10 transition-all duration-200 ${isUserDropdownOpen ? 'opacity-100 transform-none' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded transition-colors">My Account</Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded transition-colors">My Orders</Link>
                  {currentUser.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded transition-colors">Admin Panel</Link>
                  )}
                  <hr className="my-1 dark:border-gray-700" />
                  <button
                    onClick={logoutUser}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm text-primary hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded-lg transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">Register</Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={24} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu size={24} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="hidden md:flex mt-4 border-t dark:border-gray-700 pt-3">
          <nav className="w-full">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  to="/" 
                  className={`${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'} transition-colors`}
                >
                  Home
                </Link>
              </li>
              <li className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={toggleCategoryDropdown}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Categories
                </button>
                <div className={`absolute left-0 mt-2 w-48 bg-white dark:bg-dark-card shadow-lg rounded-lg p-2 z-10 transition-all duration-200 ${isCategoryDropdownOpen ? 'opacity-100 transform-none' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
                  {categories.map(category => (
                    <Link 
                      key={category.slug} 
                      to={`/products?category=${category.slug}`} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`${location.pathname === '/products' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'} transition-colors`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/news" 
                  className={`${location.pathname === '/news' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'} transition-colors`}
                >
                  News
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${location.pathname === '/contact' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'} transition-colors`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg p-4 border-t dark:border-gray-700 animate-slide-in">
          <div className="mb-4">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search for AI models..." 
                className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-card dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          <nav>
            <ul className="space-y-2">
              <li><Link to="/" className="block p-2 rounded text-primary font-medium">Home</Link></li>
              <li><Link to="/products" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Products</Link></li>
              {categories.map(category => (
                <li key={category.slug}>
                  <Link 
                    to={`/products?category=${category.slug}`} 
                    className="block p-2 pl-4 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/news" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">News</Link></li>
              <li><Link to="/contact" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contact</Link></li>
              <li><hr className="my-2 dark:border-gray-700" /></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/account" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">My Account</Link></li>
                  <li><Link to="/account/orders" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">My Orders</Link></li>
                  {currentUser.isAdmin && (
                    <li><Link to="/admin" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Admin Panel</Link></li>
                  )}
                  <li>
                    <button
                      onClick={logoutUser}
                      className="block w-full text-left p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Login</Link></li>
                  <li><Link to="/register" className="block p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Register</Link></li>
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
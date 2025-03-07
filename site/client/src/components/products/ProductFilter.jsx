import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductFilter = ({ categories, onFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: false
  });
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
  });
  
  const getSelectedCategoryName = () => {
    if (!filters.category) return null;
    const category = categories.find(cat => cat.value === filters.category);
    return category ? category.label : null;
  };
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
    
    onFilter(filters);
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCategoryChange = (categoryValue) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryValue ? '' : categoryValue
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
    });
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const appliedFiltersCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="mb-6 animate-fade-in">
      <div className="md:hidden mb-4">
        <button 
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Filters</span>
          {appliedFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {appliedFiltersCount}
            </span>
          )}
        </button>
      </div>
      
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:block transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Filters</h3>
            {(filters.category || filters.minPrice || filters.maxPrice || filters.minRating) && (
              <button 
                className="text-sm text-primary hover:underline flex items-center"
                onClick={clearFilters}
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="border-b dark:border-gray-700 pb-4">
              <button 
                onClick={() => toggleSection('category')}
                className="flex justify-between items-center w-full mb-2 font-medium text-gray-700 dark:text-gray-300"
              >
                <span>Category</span>
                {expandedSections.category ? (
                  <ArrowUp size={16} className="text-gray-500" />
                ) : (
                  <ArrowDown size={16} className="text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mt-2">
                      {categories.map(category => (
                        <div key={category.value} className="flex items-center">
                          <button 
                            onClick={() => handleCategoryChange(category.value)}
                            className={`flex items-center w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                              filters.category === category.value 
                                ? 'bg-primary-light/10 text-primary' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                              filters.category === category.value 
                                ? 'bg-primary border-primary' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {filters.category === category.value && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            {category.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Price Range Filter */}
            <div className="border-b dark:border-gray-700 pb-4">
              <button 
                onClick={() => toggleSection('price')}
                className="flex justify-between items-center w-full mb-2 font-medium text-gray-700 dark:text-gray-300"
              >
                <span>Price Range</span>
                {expandedSections.price ? (
                  <ArrowUp size={16} className="text-gray-500" />
                ) : (
                  <ArrowDown size={16} className="text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex space-x-2 mt-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="minPrice"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="maxPrice"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Rating Filter */}
            <div>
              <button 
                onClick={() => toggleSection('rating')}
                className="flex justify-between items-center w-full mb-2 font-medium text-gray-700 dark:text-gray-300"
              >
                <span>Minimum Rating</span>
                {expandedSections.rating ? (
                  <ArrowUp size={16} className="text-gray-500" />
                ) : (
                  <ArrowDown size={16} className="text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.rating && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mt-2">
                      {[5, 4, 3, 2, 1].map(star => (
                        <button
                          key={star}
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            minRating: prev.minRating === star.toString() ? '' : star.toString()
                          }))}
                          className={`flex items-center w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                            filters.minRating === star.toString()
                              ? 'bg-primary-light/10 text-primary' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                            filters.minRating === star.toString()
                              ? 'bg-primary border-primary' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {filters.minRating === star.toString() && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star 
                                key={index} 
                                size={14} 
                                className={index < star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                              />
                            ))}
                            <span className="ml-1">& Up</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Applied Filters */}
          {appliedFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applied Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <div className="bg-primary-light/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {getSelectedCategoryName()}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className="ml-1 hover:text-primary-dark"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="bg-primary-light/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {filters.minPrice && !filters.maxPrice 
                      ? `Min ${filters.minPrice}` 
                      : !filters.minPrice && filters.maxPrice 
                        ? `Max ${filters.maxPrice}`
                        : `${filters.minPrice} - ${filters.maxPrice}`
                    }
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                      className="ml-1 hover:text-primary-dark"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                
                {filters.minRating && (
                  <div className="bg-primary-light/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {`${filters.minRating}+ Stars`}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, minRating: '' }))}
                      className="ml-1 hover:text-primary-dark"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
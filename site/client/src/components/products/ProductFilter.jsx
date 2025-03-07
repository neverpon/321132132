import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';

const ProductFilter = ({ categories, onFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (filters.category) {
      params.set('category', filters.category);
    } else {
      params.delete('category');
    }
    
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
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
  
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };
  
  return (
    <div className="mb-6">
      <div className="md:hidden mb-4">
        <button 
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>
      
      <div className={`bg-white rounded-xl shadow-md p-4 md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          {(filters.category || filters.minPrice || filters.maxPrice) && (
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
          <div>
            <label className="block mb-2 font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range Filter */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Price Range</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
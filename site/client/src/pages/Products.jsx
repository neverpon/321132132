import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import { getAllProducts, getProductCategories } from '../services/productService';
import { useToast } from '../hooks/useToast';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'default');
  const { error } = useToast();
  
  const initialFilters = {
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || ''
  };
  
  const [filters, setFilters] = useState(initialFilters);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let sort, order;
        
        switch (sortOption) {
          case 'price-low':
            sort = 'price';
            order = 'asc';
            break;
          case 'price-high':
            sort = 'price';
            order = 'desc';
            break;
          case 'name-az':
            sort = 'name';
            order = 'asc';
            break;
          case 'name-za':
            sort = 'name';
            order = 'desc';
            break;
          case 'rating':
            sort = 'rating';
            order = 'desc';
            break;
          default:
            sort = '';
            order = '';
        }
        
        const params = {
          sort,
          order,
          ...filters
        };
        
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });
        
        const response = await getAllProducts(params);
        setProducts(response.products);
      } catch (err) {
        error('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortOption]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getProductCategories();
        setCategories(
          response.categories.map(category => ({
            value: category.value,
            label: category.name
          }))
        );
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Neural Networks</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="hidden sm:inline text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className={`md:w-1/4 mb-6 md:mb-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <ProductFilter 
            categories={categories} 
            onFilter={handleFilterChange}
          />
        </div>
        
        <div className="md:w-3/4">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Products;
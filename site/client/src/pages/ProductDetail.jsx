import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Shield, Download, Server, ChevronRight, ArrowLeft } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { success, error } = useToast();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        error('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      success(`${product.name} added to cart!`);
    }
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-1/2">
              <div className="h-80 bg-gray-200 rounded-xl mb-4"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Product Image */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="bg-gradient-to-r from-primary-light to-primary h-80 rounded-xl flex items-center justify-center">
            <div className="text-white text-xl font-medium">AI Neural Network Visualization</div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={18} 
                  className={star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                />
              ))}
            </div>
            <span className="text-gray-600">{product.rating} ({product.reviews || 0} reviews)</span>
          </div>
          
          <div className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Quantity and Add to Cart */}
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4 font-medium">Quantity:</label>
            <input 
              type="number" 
              id="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition mb-6"
          >
            Add to Cart
          </button>
          
          {/* Features */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Key Features:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Shield size={18} className="text-primary mt-0.5 mr-2" />
                <span>Enterprise-grade security with vulnerability testing</span>
              </li>
              <li className="flex items-start">
                <Download size={18} className="text-primary mt-0.5 mr-2" />
                <span>Instant download after purchase</span>
              </li>
              <li className="flex items-start">
                <Server size={18} className="text-primary mt-0.5 mr-2" />
                <span>Optimized for both cloud and on-premise deployment</span>
              </li>
            </ul>
          </div>
          
          {/* Technical Specs */}
          {product.details && (
            <div>
              <h3 className="font-bold mb-3">Technical Specifications:</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.details).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
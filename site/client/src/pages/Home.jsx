import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Send, Clock, ArrowRight, Star, Tag } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { getAllProducts } from '../services/productService';
import { useToast } from '../hooks/useToast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ limit: 4, sort: 'rating', order: 'desc' });
        setProducts(response.products);
      } catch (err) {
        error('Failed to load featured products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Solutions for Every Need</h1>
              <p className="text-lg mb-6 text-indigo-100">Discover pre-trained neural networks designed to tackle your most challenging problems, boost productivity, and unleash innovation.</p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/products" className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-indigo-50 transition shadow-lg">
                  Explore Products
                </Link>
                <Link to="/contact" className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                  How It Works
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-300 bg-opacity-20 rounded-full blur-3xl"></div>
                <div className="relative bg-indigo-600 bg-opacity-30 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400 border-opacity-30">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white bg-opacity-10 p-4 rounded-lg border border-white border-opacity-20 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                          {i === 1 && <Search className="text-white" size={20} />}
                          {i === 2 && <Shield className="text-white" size={20} />}
                          {i === 3 && <Clock className="text-white" size={20} />}
                          {i === 4 && <Send className="text-white" size={20} />}
                        </div>
                        <h3 className="text-sm font-medium mb-1">
                          {i === 1 && "Smart Search"}
                          {i === 2 && "Secure Models"}
                          {i === 3 && "24/7 Support"}
                          {i === 4 && "Fast Delivery"}
                        </h3>
                        <p className="text-xs text-indigo-100">
                          {i === 1 && "Find the perfect AI model"}
                          {i === 2 && "Tested for vulnerabilities"}
                          {i === 3 && "Always here to help"}
                          {i === 4 && "Instant deployment"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured AI Solutions</h2>
              <p className="text-gray-600">Explore our most popular neural networks</p>
            </div>
            
            <Link to="/products" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline">
              View All Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose AI Butik</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the highest quality neural networks with enterprise-grade security and support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-primary-light/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">All our models undergo rigorous security testing to ensure they're free from vulnerabilities and backdoors.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-primary-light/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Tag size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Get premium neural networks at prices that make sense for businesses of all sizes, from startups to enterprises.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-primary-light/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Send size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Deployment</h3>
              <p className="text-gray-600">Purchase and implement AI solutions within minutes with our streamlined delivery and integration process.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated on AI Innovations</h2>
            <p className="text-indigo-100 mb-8">Subscribe to our newsletter for the latest news, product updates, and exclusive offers.</p>
            
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
              <button type="submit" className="px-6 py-3 bg-primary-dark text-white font-medium rounded-lg hover:bg-indigo-800 transition sm:w-auto w-full">
                Subscribe
              </button>
            </form>
            
            <p className="text-indigo-200 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
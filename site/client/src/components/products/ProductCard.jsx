import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { success } = useToast();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    success(`${product.name} added to cart!`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-gradient-to-r from-primary-light to-primary h-48 flex items-center justify-center relative overflow-hidden">
          <div className="text-white text-lg font-medium">Neural Network</div>
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-primary text-xs font-bold px-2 py-1 rounded">
            {product.category}
          </div>
        </div>
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-xl font-bold text-gray-800 hover:text-primary">{product.name}</h3>
          </Link>
          <button className="text-gray-400 hover:text-red-500">
            <Heart size={18} />
          </button>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={14} 
                className={star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-1">{product.rating}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <button 
            className="px-4 py-2 bg-primary-light/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
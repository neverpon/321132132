import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  return (
    <div className="flex border-b pb-4 mb-4">
      <div className="w-20 h-20 bg-primary-light/20 rounded flex items-center justify-center text-primary">
        <span className="font-semibold">AI</span>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-gray-500 text-sm">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <button 
              onClick={handleDecrement}
              className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <Minus size={14} />
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button 
              onClick={handleIncrement}
              className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
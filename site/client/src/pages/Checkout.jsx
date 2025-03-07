import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { createOrder } from '../services/orderService';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const validateBillingInfo = () => {
    for (const [key, value] of Object.entries(billingInfo)) {
      if (!value.trim()) {
        error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };
  
  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (step === 1 && validateBillingInfo()) {
      setStep(2);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      error('Your cart is empty');
      return;
    }
    
    setProcessing(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        paymentMethod,
        paymentDetails: {
          token: 'mock_payment_token'
        },
        billingAddress: billingInfo
      };
      
      await createOrder(orderData);
      
      clearCart();
      
      success('Order placed successfully!');
      
      setStep(3);
    } catch (err) {
      error(err.response?.data?.error?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };
  
  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Checkout | AI Butik</title>
      </Helmet>
      
      {/* Step 3: Order Confirmation */}
      {step === 3 ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received and is now being processed.</p>
            
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to <span className="font-medium">{currentUser.email}</span>.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/account/orders')}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex mb-8">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <span className="text-sm font-medium">Billing Information</span>
            </div>
            <div className="flex-1 text-center relative">
              <div className={`absolute top-4 h-0.5 left-0 right-0 -translate-y-1/2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 z-10 relative ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Payment</span>
            </div>
            <div className="flex-1 text-center relative">
              <div className={`absolute top-4 h-0.5 left-0 right-0 -translate-y-1/2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 z-10 relative ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                3
              </div>
              <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Confirmation</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Checkout Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  {/* Step 1: Billing Information */}
                  {step === 1 && (
                    <form onSubmit={handleNextStep}>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Information</h2>
                      
                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={billingInfo.name}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="address" className="block mb-2 font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block mb-2 font-medium text-gray-700">City</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={billingInfo.city}
                              onChange={handleBillingChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block mb-2 font-medium text-gray-700">State / Province</label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={billingInfo.state}
                              onChange={handleBillingChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="postalCode" className="block mb-2 font-medium text-gray-700">Postal Code</label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={billingInfo.postalCode}
                              onChange={handleBillingChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="country" className="block mb-2 font-medium text-gray-700">Country</label>
                            <input
                              type="text"
                              id="country"
                              name="country"
                              value={billingInfo.country}
                              onChange={handleBillingChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => navigate('/cart')}
                          className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                          <ArrowLeft size={16} className="mr-1" />
                          Back to Cart
                        </button>
                        
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <form onSubmit={handleSubmitOrder}>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="credit_card"
                              checked={paymentMethod === 'credit_card'}
                              onChange={handlePaymentMethodChange}
                              className="mr-2"
                            />
                            <CreditCard size={20} className="mr-2 text-gray-600" />
                            <span>Credit / Debit Card</span>
                          </label>
                          
                          {paymentMethod === 'credit_card' && (
                            <div className="mt-4 ml-6 space-y-4">
                              <div>
                                <label htmlFor="cardNumber" className="block mb-2 font-medium text-gray-700">Card Number</label>
                                <input
                                  type="text"
                                  id="cardNumber"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                  placeholder="1234 5678 9012 3456"
                                  required
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                  <label htmlFor="expiryDate" className="block mb-2 font-medium text-gray-700">Expiry Date</label>
                                  <input
                                    type="text"
                                    id="expiryDate"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="MM/YY"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="cvc" className="block mb-2 font-medium text-gray-700">CVC</label>
                                  <input
                                    type="text"
                                    id="cvc"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="123"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="nameOnCard" className="block mb-2 font-medium text-gray-700">Name on Card</label>
                                <input
                                  type="text"
                                  id="nameOnCard"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bitcoin"
                              checked={paymentMethod === 'bitcoin'}
                              onChange={handlePaymentMethodChange}
                              className="mr-2"
                            />
                            <span className="mr-2 text-lg">₿</span>
                            <span>Bitcoin</span>
                          </label>
                          
                          {paymentMethod === 'bitcoin' && (
                            <div className="mt-4 ml-6">
                              <p className="text-gray-600 mb-2">Send payment to the following Bitcoin address:</p>
                              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                                bc1q8x7r0enu49lsxh4lsfkgwscaypngkpvvm7h6me
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handlePreviousStep}
                          className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                          <ArrowLeft size={16} className="mr-1" />
                          Back to Billing
                        </button>
                        
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition disabled:opacity-70 flex items-center"
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            'Complete Order'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                  
                  <div className="mb-6">
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map(item => (
                        <li key={item.id} className="py-3 flex justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-500">
                    <p>By completing your purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { User, Package, ShoppingBag, CreditCard, Settings, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserOrders } from '../services/orderService';
import { useToast } from '../hooks/useToast';

// Account Dashboard
const Dashboard = () => {
  const { currentUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await getUserOrders({ limit: 3 });
        setRecentOrders(response.orders);
      } catch (err) {
        error('Failed to load recent orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Dashboard</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
              {currentUser.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentUser.username}</h3>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Order #{order._id.slice(-6)}</span>
                      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{order.items.length} item(s)</span>
                      <span className="font-medium text-primary">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/account/orders" className="text-primary hover:underline text-sm block text-center mt-4">
                  View All Orders
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by exploring our products.</p>
                <div className="mt-6">
                  <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <Link to="/account/profile" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Edit Profile</div>
                  <div className="text-sm text-gray-500">Update your personal information</div>
                </div>
              </Link>
              
              <Link to="/account/security" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Lock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Security</div>
                  <div className="text-sm text-gray-500">Change password and security settings</div>
                </div>
              </Link>
              
              <Link to="/account/payment" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Payment Methods</div>
                  <div className="text-sm text-gray-500">Manage your payment options</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.orders);
      } catch (err) {
        error('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <span className="font-medium text-lg">Order #{order._id.slice(-6)}</span>
                      <div className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <li key={index} className="py-3 flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile
const Profile = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here would be the API call to update profile
    console.log('Updating profile:', formData);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Security
const Security = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here would be the API call to change password
    console.log('Changing password:', formData);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block mb-2 font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-2 font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Payment Methods
const PaymentMethods = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods yet</h3>
            <p className="mt-1 text-sm text-gray-500">Add a payment method to speed up checkout.</p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Account Component
const Account = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Define navigation links
  const navLinks = [
    { to: '/account', label: 'Dashboard', icon: User },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/account/profile', label: 'Edit Profile', icon: Settings },
    { to: '/account/security', label: 'Security', icon: Lock },
    { to: '/account/payment', label: 'Payment Methods', icon: CreditCard }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Account | AI Butik</title>
      </Helmet>
      
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4 mb-6 lg:mb-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
            <div className="p-6 bg-primary text-white">
              <h2 className="text-xl font-bold">My Account</h2>
              <p className="text-primary-light/90">Welcome, {currentUser.username}</p>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.to;
                  const Icon = link.icon;
                  
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={18} className="mr-2" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="security" element={<Security />} />
            <Route path="payment" element={<PaymentMethods />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Account;
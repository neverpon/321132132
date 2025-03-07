import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  
  // Define navigation links
  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];
  
  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Panel | AI Butik</title>
      </Helmet>
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside 
          className={`w-64 bg-gray-900 text-gray-100 fixed inset-y-0 z-10 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static lg:z-0`}
        >
          {/* Sidebar Header */}
          <div className="p-4 bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <div className="text-xl font-bold">AI Butik Admin</div>
            </div>
          </div>
          
          {/* Sidebar Links */}
          <nav className="py-4">
            <ul className="space-y-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center px-6 py-3 text-sm ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={18} className="mr-3" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="mt-auto border-t border-gray-700 p-4">
            <Link 
              to="/"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <Home size={18} className="mr-3" />
              <span>Back to Website</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6 lg:pl-64">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/admin" className="text-gray-500 hover:text-primary">
                    Admin
                  </Link>
                </li>
                {location.pathname !== '/admin' && (
                  <li className="flex items-center">
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="ml-1 text-gray-600 md:ml-2">
                      {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
                    </span>
                  </li>
                )}
              </ol>
            </nav>
          </div>
          
          {/* Page Content */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminLayout;
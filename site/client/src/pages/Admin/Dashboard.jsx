import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { getUserStats, getOrderStats } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStatsData, orderStatsData] = await Promise.all([
          getUserStats(),
          getOrderStats()
        ]);
        
        setUserStats(userStatsData);
        setOrderStats(orderStatsData);
      } catch (err) {
        error('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const statsCards = [
    {
      title: 'Total Users',
      value: userStats?.totalUsers || 0,
      icon: Users,
      change: userStats?.userGrowth?.lastMonth || 0,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: orderStats?.totalOrders || 0,
      icon: ShoppingBag,
      change: orderStats?.ordersThisMonth || 0,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: orderStats?.totalRevenue 
        ? `$${orderStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : '$0.00',
      icon: DollarSign,
      change: 12.5, // placeholder
      color: 'bg-green-500'
    },
    {
      title: 'Growth Rate',
      value: `${userStats?.userGrowth?.lastQuarter || 0}%`,
      icon: TrendingUp,
      change: userStats?.userGrowth?.lastQuarter - (userStats?.userGrowth?.lastMonth || 0),
      color: 'bg-amber-500'
    }
  ];
  
  if (loading) {
    return (
      <div>
        <Helmet>
          <title>Admin Dashboard | AI Butik</title>
        </Helmet>
        
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Helmet>
        <title>Admin Dashboard | AI Butik</title>
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                
                <div className="flex items-center mt-2">
                  {card.change >= 0 ? (
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500 mr-1" />
                  )}
                  
                  <span className={`text-sm font-medium ${
                    card.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(card.change)}%
                  </span>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-2">
              <span className="text-xs text-gray-500">Updated recently</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-6">Recent Orders</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Placeholder data - would be replaced with real data */}
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ORD-{1000 + i}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Customer {i}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(Math.random() * 1000).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        i % 3 === 0 ? 'bg-green-100 text-green-800' : 
                        i % 3 === 1 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Processing' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-6">New Users</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Placeholder data - would be replaced with real data */}
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          U
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            User {i}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      user{i}@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { loginUser, loading, error: authError } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (authError) {
      error(authError);
    }
  }, [authError, error]);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    try {
      await loginUser({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-dark-text">Login to Your Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input 
            type="email" 
            id="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({...errors, email: null});
            }}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">Password</label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              id="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
                ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({...errors, password: null});
              }}
            />
            <button 
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
        
        <button 
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
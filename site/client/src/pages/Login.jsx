import React from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Login | AI Butik</title>
      </Helmet>
      
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Login to AI Butik</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
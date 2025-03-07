import React from 'react';
import { Helmet } from 'react-helmet';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Register | AI Butik</title>
      </Helmet>
      
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
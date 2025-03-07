import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const { success } = useToast();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setSubmitting(false);
      success('Your message has been sent! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Contact Us | AI Butik</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact & Support</h1>
      
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Contact Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 lg:mb-0">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">Have questions about our products or services? Send us a message and our team will get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-70"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Email</div>
                    <a href="mailto:info@aibutik.com" className="text-gray-600 hover:text-primary">info@aibutik.com</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href="tel:+15551234567" className="text-gray-600 hover:text-primary">+1 (555) 123-4567</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Address</div>
                    <address className="text-gray-600 not-italic">
                      123 AI Avenue, Tech District<br />
                      San Francisco, CA 94103
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-medium">Business Hours</div>
                    <div className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (UTC)<br />
                      Saturday - Sunday: Closed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">How do I get support for purchased products?</h4>
                  <p className="text-gray-600">All customers receive priority email support and access to our documentation portal with their purchase.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800">What payment methods do you accept?</h4>
                  <p className="text-gray-600">We accept all major credit cards, PayPal, and most cryptocurrencies including Bitcoin and Ethereum.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800">Do you offer custom AI development?</h4>
                  <p className="text-gray-600">Yes, we provide custom AI development services. Please contact us with your requirements for a quote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
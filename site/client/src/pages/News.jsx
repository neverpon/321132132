import React from 'react';
import { Helmet } from 'react-helmet';

const News = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>News & Updates | AI Butik</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Latest AI News & Insights</h1>
      
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Breakthrough in Transformer Architecture Improves Efficiency by 40%</h2>
              <div className="text-sm text-gray-500 mb-4">March 5, 2025</div>
              <div className="prose max-w-none">
                <p className="mb-4">Researchers have announced a significant improvement to the transformer architecture that powers many of today's most advanced neural networks. The new approach, dubbed "EfficientTransformer," reduces computational requirements by 40% while maintaining accuracy.</p>
                
                <p className="mb-4">This breakthrough could enable more powerful AI models to run on consumer hardware, bringing advanced capabilities to smartphones and laptops without requiring cloud connectivity. The team behind the innovation demonstrated real-time language translation and image recognition tasks running smoothly on mid-range mobile devices.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Technical Innovations</h3>
                
                <p className="mb-4">The key innovation lies in a novel attention mechanism that selectively processes only the most relevant parts of the input data. Traditional transformer models compute attention scores for all possible pairs of tokens, which becomes computationally expensive as the input size grows.</p>
                
                <p className="mb-4">EfficientTransformer instead uses a hierarchical approach that first identifies regions of interest at a coarse level before applying fine-grained attention only where needed. This dramatically reduces the number of operations required while preserving the model's ability to capture long-range dependencies.</p>
                
                <blockquote className="italic border-l-4 border-primary pl-4 py-2 my-4">
                  "This is a game-changer for edge AI deployment. By reducing the computational overhead of transformer models, we're enabling a new generation of on-device AI capabilities that don't compromise on quality." — Dr. Elena Reyes, Lead Researcher
                </blockquote>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Industry Impact</h3>
                
                <p className="mb-4">Major tech companies have already expressed interest in incorporating the EfficientTransformer architecture into their products. The research team has open-sourced their implementation, leading to a flurry of activity in the developer community as engineers experiment with adapting the approach to various applications.</p>
                
                <p className="mb-4">AI Butik is currently evaluating the technology for inclusion in our next generation of neural network products, with plans to offer EfficientTransformer-based models in the coming months.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">New Regulatory Framework for AI Systems Announced</h2>
              <div className="text-sm text-gray-500 mb-4">February 28, 2025</div>
              <div className="prose max-w-none">
                <p className="mb-4">The International AI Governance Council has published a comprehensive framework for regulating commercial AI systems. The new guidelines aim to balance innovation with safety and ethical considerations.</p>
                
                <p className="mb-4">Companies developing and deploying neural networks will need to implement transparency measures and undergo regular audits to ensure compliance with the new standards. The framework has been endorsed by 27 countries and is expected to influence AI regulation globally.</p>
                
                <p className="mb-4">Key requirements include:</p>
                
                <ul className="list-disc pl-6 mb-4">
                  <li>Mandatory risk assessments for high-impact AI systems</li>
                  <li>Documentation of training data and model architecture</li>
                  <li>Human oversight for critical decision-making systems</li>
                  <li>Regular security audits and vulnerability testing</li>
                  <li>Clear disclosure when users are interacting with AI</li>
                </ul>
                
                <p className="mb-4">AI Butik already meets or exceeds most of these requirements, and we're committed to full compliance with the new framework as it is implemented across different jurisdictions.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Small Business Adoption of AI Reaches New Heights</h2>
              <div className="text-sm text-gray-500 mb-4">February 20, 2025</div>
              <div className="prose max-w-none">
                <p className="mb-4">A recent survey reveals that over 65% of small businesses now utilize AI solutions in some capacity, up from just 32% two years ago. The growing availability of affordable, pre-trained neural networks has been cited as a key factor in this rapid adoption.</p>
                
                <p className="mb-4">The most common applications include customer service automation, inventory management, and personalized marketing campaigns. Small business owners report significant improvements in operational efficiency and customer satisfaction after implementing AI tools.</p>
                
                <p className="mb-4">Importantly, the survey found that businesses using AI solutions reported an average revenue increase of 18% compared to those that had not adopted AI technologies. This points to a competitive advantage that may accelerate adoption further.</p>
                
                <p className="mb-4">The democratization of AI technology is transforming how small businesses operate, enabling them to leverage capabilities that were previously available only to large enterprises with substantial technology budgets.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bitcoin Exchange Rate</h3>
              <div className="text-3xl font-bold text-primary mb-2">$78,432.21</div>
              <div className="text-sm text-green-500 font-medium mb-3">+2.4% (24h)</div>
              <p className="text-sm text-gray-500">Last updated: March 7, 2025 09:15 UTC</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming AI Events</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-semibold text-gray-800">AI Summit 2025</div>
                  <div className="text-sm text-gray-600">March 15-17, 2025</div>
                  <div className="text-sm text-gray-600">San Francisco, CA</div>
                </li>
                <li>
                  <div className="font-semibold text-gray-800">Neural Network Workshop</div>
                  <div className="text-sm text-gray-600">April 5, 2025</div>
                  <div className="text-sm text-gray-600">Online Event</div>
                </li>
                <li>
                  <div className="font-semibold text-gray-800">Ethical AI Conference</div>
                  <div className="text-sm text-gray-600">April 22-23, 2025</div>
                  <div className="text-sm text-gray-600">Berlin, Germany</div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Subscribe to Updates</h3>
              <p className="text-gray-600 mb-4">Stay informed about the latest developments in AI technology and industry news.</p>
              <form>
                <div className="mb-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
import React from 'react';
import { ChatWidget } from '../components/ChatWidget/ChatWidget';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechNews Today</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-900 font-medium">Home</a>
              <a href="/technology" className="text-gray-500 hover:text-gray-900">Technology</a>
              <a href="/business" className="text-gray-500 hover:text-gray-900">Business</a>
              <a href="/science" className="text-gray-500 hover:text-gray-900">Science</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Breaking: AI Revolution Continues
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Latest developments in artificial intelligence are reshaping industries worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Artificial Intelligence Transforms Multiple Industries
              </h3>
              <p className="text-gray-600 mb-4">
                Recent reports indicate that artificial intelligence technologies are revolutionizing
                various sectors of the economy. From healthcare to finance, AI applications are
                becoming increasingly sophisticated and widespread.
              </p>
              <p className="text-gray-600 mb-4">
                Major technology companies are investing billions in AI research and development,
                leading to breakthrough innovations in machine learning, natural language processing,
                and computer vision. These advancements are expected to create new job opportunities
                while also raising concerns about automation's impact on traditional employment.
              </p>
              <p className="text-gray-600 mb-4">
                Healthcare providers are using AI to improve diagnostic accuracy, while financial
                institutions leverage machine learning algorithms for fraud detection and risk
                assessment. The automotive industry continues to make strides in autonomous vehicle
                technology, promising safer and more efficient transportation systems.
              </p>
              <p className="text-gray-600">
                As AI capabilities continue to expand, policymakers and industry leaders are
                working together to establish ethical guidelines and regulatory frameworks to
                ensure responsible development and deployment of these powerful technologies.
              </p>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Articles */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h4>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Machine Learning Breakthrough</h5>
                  <p className="text-sm text-gray-600">Scientists achieve new milestone in neural network training</p>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Tech Giants Invest in AI</h5>
                  <p className="text-sm text-gray-600">Major companies announce record investments in AI research</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Future of Work</h5>
                  <p className="text-sm text-gray-600">How AI will reshape the job market in the next decade</p>
                </div>
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Latest News</h4>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Stock Market Update</p>
                  <p className="text-gray-600">Tech stocks surge amid AI optimism</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Climate Change</p>
                  <p className="text-gray-600">New renewable energy initiatives announced</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Space Exploration</p>
                  <p className="text-gray-600">NASA plans new missions to Mars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">About TechNews Today</h5>
              <p className="text-gray-300">
                Your trusted source for the latest technology news, business insights, and
                scientific breakthroughs. Stay informed with our comprehensive coverage.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Artificial Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Climate Technology</a></li>
                <li><a href="#" className="hover:text-white">Space & Science</a></li>
                <li><a href="#" className="hover:text-white">Business News</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <p className="text-gray-300">
                Email: news@technewstoday.com<br />
                Phone: (555) 123-4567<br />
                Address: 123 Tech Street, Innovation City
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget position="bottom-center" />
    </div>
  );
};

export default Home;
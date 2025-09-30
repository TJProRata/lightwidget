import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatWidget2 } from '../components/ChatWidget2/ChatWidget2';

const Business = () => {
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechNews Today</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="/technology" className="text-gray-500 hover:text-gray-900">Technology</a>
              <a href="/business" className="text-gray-900 font-medium">Business</a>
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
              Business & Innovation Hub
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover the latest trends, market insights, and breakthrough innovations shaping the business world
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Business Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">Markets</span>
                  <span className="text-gray-500 text-sm ml-2">2 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Tech Stocks Rally on AI Investment News
                </h4>
                <p className="text-gray-600 mb-4">
                  Major technology companies see significant gains following announcements of increased AI research funding and partnerships.
                </p>
                <a href="#" className="text-gray-700 font-medium hover:text-gray-900">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded">Startups</span>
                  <span className="text-gray-500 text-sm ml-2">4 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Fintech Startup Raises $50M Series B
                </h4>
                <p className="text-gray-600 mb-4">
                  Revolutionary payment platform secures major funding round led by top-tier venture capital firms.
                </p>
                <a href="#" className="text-gray-700 font-medium hover:text-gray-900">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-zinc-100 to-zinc-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-zinc-100 text-zinc-700 text-xs font-medium px-2.5 py-0.5 rounded">Industry</span>
                  <span className="text-gray-500 text-sm ml-2">6 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Sustainable Energy Investments Surge
                </h4>
                <p className="text-gray-600 mb-4">
                  Corporate investments in renewable energy projects reach record highs as companies commit to carbon neutrality.
                </p>
                <a href="#" className="text-gray-700 font-medium hover:text-gray-900">Read more →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded">Featured Analysis</span>
                <span className="text-gray-500 text-sm ml-3">Today</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                The Future of Digital Transformation in Enterprise
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  As we navigate an increasingly digital landscape, enterprises worldwide are accelerating their
                  digital transformation initiatives. Recent market research indicates that companies investing in
                  comprehensive digital strategies are outperforming their competitors by significant margins.
                </p>
                <p className="text-gray-600 mb-4">
                  Cloud adoption has reached unprecedented levels, with 94% of enterprises now utilizing cloud
                  services in some capacity. This shift has enabled organizations to scale rapidly, reduce operational
                  costs, and improve collaboration across distributed teams. The COVID-19 pandemic acted as a catalyst,
                  forcing many businesses to digitize operations that had remained analog for decades.
                </p>
                <p className="text-gray-600 mb-4">
                  Artificial intelligence and machine learning are no longer emerging technologies—they're becoming
                  essential business tools. Companies are leveraging AI for everything from customer service chatbots
                  to predictive analytics that inform strategic decision-making. The integration of AI into business
                  processes is creating new efficiencies and opening up previously impossible opportunities.
                </p>
                <p className="text-gray-600 mb-6">
                  However, digital transformation isn't just about technology adoption. Successful organizations are
                  also investing heavily in digital literacy training for their workforce, establishing new governance
                  frameworks for data management, and reimagining their customer experience strategies from the ground up.
                </p>

                {/* Key Statistics */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Key Market Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700">$2.3T</div>
                      <div className="text-sm text-gray-600">Global digital transformation spending by 2025</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700">87%</div>
                      <div className="text-sm text-gray-600">of companies believe digital transformation is critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700">3x</div>
                      <div className="text-sm text-gray-600">faster revenue growth for digital leaders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700">45%</div>
                      <div className="text-sm text-gray-600">increase in customer satisfaction scores</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Looking ahead, the businesses that will thrive are those that view digital transformation not as a
                  one-time project, but as an ongoing evolution. The most successful organizations are building cultures
                  of continuous innovation, where adaptation and learning become core competencies rather than
                  occasional initiatives.
                </p>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Market Indicators */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Market Indicators</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">NASDAQ Tech</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+2.34%</div>
                    <div className="text-sm text-gray-600">15,847.23</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">S&P 500</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+1.87%</div>
                    <div className="text-sm text-gray-600">4,523.12</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Crypto Index</span>
                  <div className="text-right">
                    <div className="font-bold text-red-600">-0.45%</div>
                    <div className="text-sm text-gray-600">42,156.78</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Trending in Business</h4>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Remote Work Evolution</h5>
                  <p className="text-sm text-gray-600">How hybrid models are reshaping corporate culture</p>
                  <span className="text-xs text-gray-600 font-medium">#FutureOfWork</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">ESG Investing</h5>
                  <p className="text-sm text-gray-600">Sustainable investment strategies gain momentum</p>
                  <span className="text-xs text-gray-600 font-medium">#Sustainability</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Supply Chain Innovation</h5>
                  <p className="text-sm text-gray-600">AI-driven logistics transforming global commerce</p>
                  <span className="text-xs text-gray-600 font-medium">#SupplyChain</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Digital Banking</h5>
                  <p className="text-sm text-gray-600">Fintech disruption accelerates traditional banking evolution</p>
                  <span className="text-xs text-gray-600 font-medium">#Fintech</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Business Insights Newsletter</h4>
              <p className="text-gray-300 text-sm mb-4">
                Get weekly analysis and market insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                />
                <button className="w-full bg-white text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">About TechNews Today</h5>
              <p className="text-gray-300 text-sm">
                Your trusted source for business insights, market analysis, and innovation news.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Business Categories</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Markets & Finance</a></li>
                <li><a href="#" className="hover:text-white">Startups & VC</a></li>
                <li><a href="#" className="hover:text-white">Digital Transformation</a></li>
                <li><a href="#" className="hover:text-white">Industry Analysis</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Market Data</a></li>
                <li><a href="#" className="hover:text-white">Research Reports</a></li>
                <li><a href="#" className="hover:text-white">Expert Interviews</a></li>
                <li><a href="#" className="hover:text-white">Business Tools</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect</h5>
              <p className="text-gray-300 text-sm">
                business@technewstoday.com<br />
                Follow us for real-time market updates
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      {currentUser && (
        <ChatWidget2
          position="bottom-center"
          config={{
            apiKey: currentUser.apiKey,
            userId: currentUser._id
          }}
        />
      )}
    </div>
  );
};

export default Business;
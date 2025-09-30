import React, { useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Science = () => {
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);

  useEffect(() => {
    if (currentUser?.apiKey) {
      const loaderUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3001/loader.js'
        : 'https://lightwidget.vercel.app/loader.js';

      window.LightWidgetConfig = {
        apiKey: currentUser.apiKey,
        position: currentUser.settings?.position || 'bottom-center',
        theme: currentUser.settings?.theme || 'light'
      };

      const script = document.createElement('script');
      script.src = loaderUrl;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        delete window.LightWidgetConfig;
      };
    }
  }, [currentUser?.apiKey, currentUser?.settings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechNews Today</h1>
            </div>
            <nav className="flex space-x-8">
              <span className="text-gray-500 cursor-default">Home</span>
              <span className="text-gray-500 cursor-default">Technology</span>
              <span className="text-gray-500 cursor-default">Business</span>
              <span className="text-gray-900 font-medium cursor-default">Science</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Science & Discovery Hub
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore groundbreaking research, scientific breakthroughs, and the latest discoveries shaping our understanding of the universe
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Science Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">Space</span>
                  <span className="text-gray-500 text-sm ml-2">2 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  New Exoplanet Discovery Shows Signs of Atmosphere
                </h4>
                <p className="text-gray-600 mb-4">
                  Astronomers detect potential biosignatures in the atmosphere of a rocky planet 120 light-years away, opening new possibilities in the search for life.
                </p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-green-100 to-emerald-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded">Biology</span>
                  <span className="text-gray-500 text-sm ml-2">4 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  CRISPR Breakthrough in Genetic Disease Treatment
                </h4>
                <p className="text-gray-600 mb-4">
                  Revolutionary gene-editing technique successfully corrects inherited disorder in clinical trial, marking milestone in precision medicine.
                </p>
                <a href="#" className="text-green-600 font-medium hover:text-green-800">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-100 to-violet-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded">Physics</span>
                  <span className="text-gray-500 text-sm ml-2">6 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Quantum Computer Achieves New Milestone
                </h4>
                <p className="text-gray-600 mb-4">
                  Scientists demonstrate quantum advantage in complex calculations, bringing practical quantum computing closer to reality.
                </p>
                <a href="#" className="text-purple-600 font-medium hover:text-purple-800">Read more →</a>
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
                <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">Featured Research</span>
                <span className="text-gray-500 text-sm ml-3">Today</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Climate Science: Understanding Earth's Changing Systems and the Quest for Sustainable Solutions
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  From healthcare to finance, AI applications are becoming increasingly sophisticated. Recent breakthroughs
                  in machine learning have enabled computers to process natural language, recognize images, and make
                  complex decisions with unprecedented accuracy. These advances are reshaping industries and creating
                  new possibilities for innovation.
                </p>
                <p className="text-gray-600 mb-4">
                  Climate scientists are utilizing advanced modeling techniques and satellite data to better understand
                  the complex interactions between Earth's atmosphere, oceans, and land surfaces. Recent research has
                  revealed accelerating changes in polar ice sheets, ocean circulation patterns, and global temperature
                  distributions that exceed earlier predictions.
                </p>
                <p className="text-gray-600 mb-4">
                  The integration of artificial intelligence with climate modeling has enabled researchers to process
                  vast amounts of environmental data with unprecedented speed and accuracy. Machine learning algorithms
                  are now identifying patterns in climate behavior that were previously undetectable, leading to more
                  accurate predictions of future climate scenarios.
                </p>
                <p className="text-gray-600 mb-6">
                  International collaboration has become essential in climate research, with scientists from over 100
                  countries sharing data, methodologies, and findings. This global effort has produced comprehensive
                  assessments that inform policy decisions and guide adaptation strategies worldwide.
                </p>

                {/* Key Statistics */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Key Research Findings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">1.1°C</div>
                      <div className="text-sm text-gray-600">Global temperature increase since pre-industrial era</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">3.3mm</div>
                      <div className="text-sm text-gray-600">Average annual sea level rise rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">410ppm</div>
                      <div className="text-sm text-gray-600">Current atmospheric CO₂ concentration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">95%</div>
                      <div className="text-sm text-gray-600">Scientific consensus on human-caused climate change</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Looking forward, climate science continues to evolve with new technologies and methodologies. From
                  improved satellite observations to advanced computer simulations, researchers are working to provide
                  society with the knowledge needed to address one of humanity's greatest challenges. The next decade
                  will be crucial for implementing science-based solutions and monitoring their effectiveness.
                </p>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Research Highlights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Research Highlights</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Nature Journal</span>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">42 articles</div>
                    <div className="text-sm text-gray-600">This week</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Science Magazine</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">38 articles</div>
                    <div className="text-sm text-gray-600">This week</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Cell Press</span>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">27 articles</div>
                    <div className="text-sm text-gray-600">This week</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Trending in Science</h4>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Artificial Intelligence</h5>
                  <p className="text-sm text-gray-600">Machine learning revolutionizes drug discovery</p>
                  <span className="text-xs text-blue-600 font-medium">#AI #Research</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Space Exploration</h5>
                  <p className="text-sm text-gray-600">Mars missions reveal new geological findings</p>
                  <span className="text-xs text-blue-600 font-medium">#Space</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Renewable Energy</h5>
                  <p className="text-sm text-gray-600">Solar cell efficiency reaches record levels</p>
                  <span className="text-xs text-blue-600 font-medium">#CleanEnergy</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Neuroscience</h5>
                  <p className="text-sm text-gray-600">Brain-computer interfaces show promising results</p>
                  <span className="text-xs text-blue-600 font-medium">#Neuroscience</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-indigo-800 rounded-lg shadow-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Science Updates Newsletter</h4>
              <p className="text-indigo-100 text-sm mb-4">
                Get weekly research highlights and breakthrough discoveries delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                />
                <button className="w-full bg-white text-indigo-800 font-medium py-2 px-4 rounded hover:bg-indigo-50 transition-colors">
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
                Your trusted source for scientific discoveries, research insights, and breakthrough innovations.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Science Categories</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Space & Astronomy</a></li>
                <li><a href="#" className="hover:text-white">Biology & Medicine</a></li>
                <li><a href="#" className="hover:text-white">Physics & Chemistry</a></li>
                <li><a href="#" className="hover:text-white">Climate & Environment</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Research Papers</a></li>
                <li><a href="#" className="hover:text-white">Scientific Journals</a></li>
                <li><a href="#" className="hover:text-white">Expert Interviews</a></li>
                <li><a href="#" className="hover:text-white">Data Visualizations</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect</h5>
              <p className="text-gray-300 text-sm">
                science@technewstoday.com<br />
                Follow us for the latest research updates
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Science;
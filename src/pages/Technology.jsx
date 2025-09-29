import React from 'react';
import { ChatWidget2 } from '../components/ChatWidget2/ChatWidget2';

const Technology = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechNews Today</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="/technology" className="text-gray-900 font-medium">Technology</a>
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
              Technology & Innovation
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Stay ahead with the latest breakthroughs in AI, software development, hardware, and emerging technologies
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Technology Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-100 to-purple-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded">AI & ML</span>
                  <span className="text-gray-500 text-sm ml-2">1 hour ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  GPT-5 Rumors Surface with Multimodal Capabilities
                </h4>
                <p className="text-gray-600 mb-4">
                  Industry insiders hint at revolutionary advances in reasoning and real-time learning for next-generation AI models.
                </p>
                <a href="#" className="text-purple-600 font-medium hover:text-purple-800">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-cyan-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">Cloud Computing</span>
                  <span className="text-gray-500 text-sm ml-2">3 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Edge Computing Becomes Mainstream in 2024
                </h4>
                <p className="text-gray-600 mb-4">
                  Major cloud providers expand edge computing offerings as demand for low-latency processing grows exponentially.
                </p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Read more →</a>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-pink-100 to-rose-200"></div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded">Hardware</span>
                  <span className="text-gray-500 text-sm ml-2">5 hours ago</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  3nm Chips Enter Mass Production
                </h4>
                <p className="text-gray-600 mb-4">
                  Leading semiconductor manufacturers achieve breakthrough in miniaturization, promising unprecedented performance gains.
                </p>
                <a href="#" className="text-pink-600 font-medium hover:text-pink-800">Read more →</a>
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
                <span className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded">Deep Dive</span>
                <span className="text-gray-500 text-sm ml-3">Today</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                The Evolution of AI: From Machine Learning to Artificial General Intelligence
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  Artificial Intelligence has progressed from simple rule-based systems to sophisticated neural networks
                  capable of natural language understanding, image generation, and complex reasoning. As we stand at the
                  threshold of potentially achieving Artificial General Intelligence (AGI), the implications for society,
                  economy, and human potential are profound.
                </p>
                <p className="text-gray-600 mb-4">
                  The journey began with symbolic AI in the 1950s, evolved through expert systems in the 1980s, and
                  accelerated dramatically with deep learning breakthroughs in the 2010s. Today's large language models
                  like GPT-4, Claude, and Gemini demonstrate capabilities that were unimaginable just a decade ago—from
                  writing code to analyzing medical images with accuracy rivaling human experts.
                </p>
                <p className="text-gray-600 mb-4">
                  Machine learning techniques have become increasingly sophisticated, with transformers revolutionizing
                  how AI processes sequential data. Attention mechanisms allow models to focus on relevant information,
                  enabling more coherent and contextually appropriate responses. Reinforcement learning from human
                  feedback (RLHF) has further refined these systems, aligning AI behavior with human preferences and values.
                </p>
                <p className="text-gray-600 mb-6">
                  The race toward AGI—systems with human-level intelligence across all cognitive tasks—has intensified.
                  Major tech companies are investing billions in compute infrastructure, novel architectures, and training
                  techniques. However, significant challenges remain: common sense reasoning, causal understanding, and
                  maintaining alignment with human values at superhuman intelligence levels.
                </p>

                {/* Key Statistics */}
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">AI Industry Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700">$190B</div>
                      <div className="text-sm text-gray-600">Global AI market size by 2025</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700">37%</div>
                      <div className="text-sm text-gray-600">Annual AI adoption growth rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700">97M</div>
                      <div className="text-sm text-gray-600">Jobs created by AI by 2025</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700">80%</div>
                      <div className="text-sm text-gray-600">of enterprises using AI in production</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Beyond pure intelligence metrics, modern AI research focuses on safety, interpretability, and robustness.
                  Techniques like Constitutional AI, adversarial training, and mechanistic interpretability aim to create
                  systems that are not just powerful but also reliable and aligned with human values.
                </p>

                <p className="text-gray-600">
                  As we navigate this transformative era, collaboration between researchers, policymakers, and ethicists
                  becomes crucial. The path to beneficial AGI requires not only technical breakthroughs but also thoughtful
                  governance frameworks that ensure these powerful technologies serve humanity's collective interests.
                </p>
              </div>
            </article>

            {/* Additional Tech News */}
            <div className="mt-8 space-y-6">
              <article className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-cyan-100 text-cyan-700 text-xs font-medium px-2.5 py-0.5 rounded">Cybersecurity</span>
                  <span className="text-gray-500 text-sm ml-2">2 hours ago</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  Zero-Trust Architecture Becomes Standard Practice
                </h4>
                <p className="text-gray-600">
                  Organizations worldwide adopt zero-trust security models in response to sophisticated cyber threats.
                  The "never trust, always verify" approach is reshaping enterprise security infrastructure.
                </p>
              </article>

              <article className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded">Green Tech</span>
                  <span className="text-gray-500 text-sm ml-2">4 hours ago</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  Data Centers Transition to 100% Renewable Energy
                </h4>
                <p className="text-gray-600">
                  Major cloud providers achieve carbon neutrality milestones as sustainable computing becomes a
                  competitive advantage. Innovations in cooling and power efficiency reduce environmental impact.
                </p>
              </article>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Trends */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Trending Topics</h4>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Quantum Computing</h5>
                  <p className="text-sm text-gray-600">IBM achieves 1000+ qubit milestone</p>
                  <span className="text-xs text-purple-600 font-medium">#Quantum</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">Web3 & Blockchain</h5>
                  <p className="text-sm text-gray-600">Decentralized apps gain mainstream adoption</p>
                  <span className="text-xs text-purple-600 font-medium">#Web3</span>
                </div>
                <div className="border-b pb-3">
                  <h5 className="font-semibold text-gray-900">5G & Beyond</h5>
                  <p className="text-sm text-gray-600">6G research accelerates with TeraHz frequencies</p>
                  <span className="text-xs text-purple-600 font-medium">#Connectivity</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">AR/VR Innovation</h5>
                  <p className="text-sm text-gray-600">Apple Vision Pro transforms spatial computing</p>
                  <span className="text-xs text-purple-600 font-medium">#MixedReality</span>
                </div>
              </div>
            </div>

            {/* Developer Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Developer Resources</h4>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">🚀 New Frameworks</p>
                  <p className="text-gray-600">React 19 beta released with compiler</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">📚 Open Source</p>
                  <p className="text-gray-600">LLaMA 3 available for commercial use</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">🔧 DevOps Tools</p>
                  <p className="text-gray-600">Kubernetes 1.30 improves observability</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">💻 Programming Languages</p>
                  <p className="text-gray-600">Rust adoption grows in enterprise</p>
                </div>
              </div>
            </div>

            {/* Tech Events */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h4>
              <div className="space-y-3">
                <div className="text-sm border-b pb-2">
                  <p className="font-medium text-gray-900">AWS re:Invent 2024</p>
                  <p className="text-gray-600">Dec 2-6, Las Vegas</p>
                </div>
                <div className="text-sm border-b pb-2">
                  <p className="font-medium text-gray-900">NeurIPS Conference</p>
                  <p className="text-gray-600">Dec 10-16, New Orleans</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">CES 2025</p>
                  <p className="text-gray-600">Jan 7-10, Las Vegas</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Tech Newsletter</h4>
              <p className="text-purple-100 text-sm mb-4">
                Get daily updates on AI, cloud, security, and emerging technologies.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                />
                <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded hover:bg-purple-50 transition-colors">
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
                Your trusted source for cutting-edge technology news, AI breakthroughs, and innovation insights.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Tech Categories</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Artificial Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Cloud & DevOps</a></li>
                <li><a href="#" className="hover:text-white">Cybersecurity</a></li>
                <li><a href="#" className="hover:text-white">Hardware & IoT</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white">Developer Docs</a></li>
                <li><a href="#" className="hover:text-white">Tech Tutorials</a></li>
                <li><a href="#" className="hover:text-white">API References</a></li>
                <li><a href="#" className="hover:text-white">Community Forum</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect</h5>
              <p className="text-gray-300 text-sm">
                tech@technewstoday.com<br />
                Follow us for real-time tech updates
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget2 position="bottom-center" />
    </div>
  );
};

export default Technology;
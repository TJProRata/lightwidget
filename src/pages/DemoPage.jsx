import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function DemoPage() {
  const { userId } = useParams();
  const user = useQuery(api.users.getUserById.getUserById, { userId });

  useEffect(() => {
    // Load widget script when user data is available
    if (user?.apiKey) {
      // Use localhost loader in development, production URL in production
      const loaderUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3001/loader.js'
        : 'https://lightwidget.vercel.app/loader.js';

      // Set up config
      window.LightWidgetConfig = {
        apiKey: user.apiKey,
        position: user.settings?.position || 'bottom-center',
        theme: user.settings?.theme || 'light'
      };

      // Load loader script
      const script = document.createElement('script');
      script.src = loaderUrl;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup: remove script and config when component unmounts
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        delete window.LightWidgetConfig;
      };
    }
  }, [user?.apiKey, user?.settings]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!user.apiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Widget Not Configured</h1>
          <p className="text-gray-600">
            This user hasn't configured their widget yet. Please complete the setup in your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              LightWidget Demo
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 mb-8">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">
              Widget Demo Active
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Try the{' '}
            <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              AI Chat Widget
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Click the chat button in the corner to start a conversation with our AI assistant.
            Ask questions, get help, or just explore what the widget can do!
          </p>

          {/* Instructions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Click the Chat Button</h3>
                <p className="text-sm text-gray-600">
                  Find the chat button in the corner of your screen and click it to open
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Ask a Question</h3>
                <p className="text-sm text-gray-600">
                  Type your question in the chat input and hit enter or click send
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get AI Responses</h3>
                <p className="text-sm text-gray-600">
                  Our AI assistant will respond with helpful, intelligent answers
                </p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Try These Questions</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "What is LightWidget?",
                "How do I install the widget on my website?",
                "What features does the widget have?",
                "How much does it cost?",
                "Can I customize the widget colors?",
                "Is there a free trial?"
              ].map((question, index) => (
                <div
                  key={index}
                  className="text-left px-4 py-3 bg-purple-50 rounded-lg border border-purple-200 text-sm text-gray-700"
                >
                  💬 {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 mb-2">
            Powered by <span className="font-semibold">LightWidget</span>
          </p>
          <p className="text-sm text-gray-500">
            {user.name ? `Widget configured by ${user.name}` : 'Demo widget'}
          </p>
        </div>
      </footer>
    </div>
  );
}
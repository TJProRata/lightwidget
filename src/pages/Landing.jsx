import React, { useState } from 'react';
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton } from '../components/auth/SignInButton';
import { SignInForm } from '../components/auth/SignInForm';
import { Navigate, useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = ["email@prorata.ai", "tj@prorata.ai"];

export default function Landing() {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);

  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      <Authenticated>
        {currentUser === undefined ? (
          // Still loading user data
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          // Redirect based on admin status
          <Navigate to={isAdmin ? "/admin/users" : "/dashboard"} replace />
        )}
      </Authenticated>

      <Unauthenticated>
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                LightWidget
              </span>
            </div>
            <button
              onClick={() => navigate('/business')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Business Demo
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative">
          <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 mb-8">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">
                  AI-Powered Chat for Your Website
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Add{' '}
                <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  AI Chat
                </span>
                <br />
                to Your Website
                <br />
                in Minutes
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Embed a beautiful, customizable AI chat widget that answers questions about your website content.
                No coding required.
              </p>

              {/* CTA */}
              <div className="flex flex-col items-center gap-6 mb-16">
                {!showEmailForm ? (
                  <>
                    <SignInButton />
                    <div className="flex items-center gap-4 w-full max-w-md">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-sm text-gray-500">or</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="px-8 py-4 text-gray-700 font-semibold rounded-xl hover:bg-white/50 border border-gray-300 transition-colors"
                    >
                      Sign in with Email
                    </button>
                    <a
                      href="#features"
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Learn more
                    </a>
                  </>
                ) : (
                  <>
                    <SignInForm />
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      ← Back to sign-in options
                    </button>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>5-minute setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Fully customizable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-gray-600">Powerful features, simple setup</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast Setup</h3>
                <p className="text-gray-600">
                  Sign in with Google, configure your widget, and embed it on your site in under 5 minutes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fully Customizable</h3>
                <p className="text-gray-600">
                  Match your brand with custom colors, themes, and positioning options.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Responses</h3>
                <p className="text-gray-600">
                  Powered by OpenAI GPT-4 to understand and answer questions about your content intelligently.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-600">
              <p>&copy; 2024 LightWidget. Powered by AI.</p>
            </div>
          </footer>
        </main>
      </Unauthenticated>
    </div>
  );
}
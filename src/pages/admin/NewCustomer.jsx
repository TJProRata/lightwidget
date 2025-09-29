import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function NewCustomer() {
  const navigate = useNavigate();
  const createCustomer = useMutation(api.customers.createCustomer);

  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await createCustomer({
        email: email,
        domain: domain,
        plan: plan
      });

      setResult(response);
      setIsSubmitting(false);
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Customer Created Successfully!</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Customer Created!</h2>
              <p className="text-center text-gray-600">Save the API key below - it won't be shown again.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
                  {result.customerId}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="font-mono text-sm bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-900">
                  {result.apiKey}
                </div>
                <p className="mt-1 text-xs text-red-600">⚠️ Save this key - it cannot be retrieved later!</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                  {email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                  {domain}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200 capitalize">
                  {plan}
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Link
                to="/admin"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => navigate(`/admin/customers/${result.id}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Customer Details
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Customer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="customer@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Customer's contact email address
              </p>
            </div>

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Domain *
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                placeholder="example.com or *.example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Domain where widget will be installed. Supports wildcards (e.g., *.example.com)
              </p>
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                id="plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Pricing plan for this customer
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? 'Creating Customer...' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
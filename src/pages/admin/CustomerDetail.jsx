import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customers = useQuery(api.customers.getAllCustomers) || [];
  const customer = customers.find(c => c._id === id);

  const updateOpenAIKey = useMutation(api.customers.updateOpenAIKey);
  const updateCustomerSettings = useMutation(api.customers.updateCustomerSettings);
  const updateCustomerDomain = useMutation(api.customers.updateCustomerDomain);
  const setCustomerActive = useMutation(api.customers.setCustomerActive);
  const regenerateApiKey = useMutation(api.customers.regenerateApiKey);

  // Analytics queries
  const usageStats = useQuery(
    api.analytics.getCustomerUsageStats,
    customer ? { customerId: customer.customerId } : "skip"
  );

  const [openaiKey, setOpenaiKey] = useState('');
  const [domain, setDomain] = useState('');
  const [theme, setTheme] = useState('light');
  const [position, setPosition] = useState('bottom-center');
  const [brandColor, setBrandColor] = useState('#C081FF');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  React.useEffect(() => {
    if (customer) {
      setDomain(customer.domain || '');
      setTheme(customer.settings?.theme || 'light');
      setPosition(customer.settings?.position || 'bottom-center');
      setBrandColor(customer.settings?.brandColor || '#C081FF');
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer not found</h2>
          <Link to="/admin" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateOpenAIKey = async () => {
    if (!openaiKey.trim()) {
      alert('Please enter an OpenAI API key');
      return;
    }
    try {
      await updateOpenAIKey({
        customerId: customer.customerId,
        openaiApiKey: openaiKey
      });
      alert('OpenAI API key updated successfully');
      setOpenaiKey('');
    } catch (error) {
      alert('Failed to update OpenAI key: ' + error.message);
    }
  };

  const handleUpdateDomain = async () => {
    try {
      await updateCustomerDomain({
        customerId: customer.customerId,
        domain: domain
      });
      alert('Domain updated successfully');
    } catch (error) {
      alert('Failed to update domain: ' + error.message);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateCustomerSettings({
        customerId: customer.customerId,
        settings: { theme, position, brandColor }
      });
      alert('Settings updated successfully');
    } catch (error) {
      alert('Failed to update settings: ' + error.message);
    }
  };

  const handleToggleActive = async () => {
    try {
      await setCustomerActive({
        customerId: customer.customerId,
        isActive: !customer.isActive
      });
    } catch (error) {
      alert('Failed to toggle status: ' + error.message);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Are you sure? This will invalidate the old API key.')) {
      return;
    }
    try {
      const result = await regenerateApiKey({
        customerId: customer.customerId
      });
      alert('New API key: ' + result.apiKey);
    } catch (error) {
      alert('Failed to regenerate API key: ' + error.message);
    }
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<!-- LightWidget Installation -->
<script>
  window.LightWidgetConfig = {
    apiKey: '${customer.apiKey}',
    position: '${position}',
    theme: '${theme}'
  };
</script>
<script src="https://widget.lightwidget.com/loader.js" async></script>`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
            </div>
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                customer.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {customer.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Stats Overview */}
        {usageStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Total Queries</div>
              <div className="text-3xl font-bold text-gray-900">{usageStats.totalQueries}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Today</div>
              <div className="text-3xl font-bold text-blue-600">{usageStats.queriesToday}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Last 7 Days</div>
              <div className="text-3xl font-bold text-purple-600">{usageStats.queriesLast7Days}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Last 30 Days</div>
              <div className="text-3xl font-bold text-green-600">{usageStats.queriesLast30Days}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                    {customer.customerId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-sm text-gray-900">{customer.email || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan
                  </label>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    customer.plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.plan}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <div className="text-sm text-gray-900">
                    {new Date(customer.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">API Key</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Widget API Key
                    </label>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={customer.apiKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(customer.apiKey, setCopiedApiKey)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copiedApiKey ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleRegenerateApiKey}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Regenerate API Key
                </button>
              </div>
            </div>

            {/* Domain Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com or *.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supports wildcards (e.g., *.example.com for all subdomains)
                  </p>
                </div>
                <button
                  onClick={handleUpdateDomain}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Domain
                </button>
              </div>
            </div>

            {/* OpenAI Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">OpenAI Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder={customer.openaiApiKey ? '••••••••••••••••' : 'sk-...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {customer.openaiApiKey
                      ? 'Key is configured. Enter new key to update.'
                      : 'No key configured. Using fallback key.'}
                  </p>
                </div>
                <button
                  onClick={handleUpdateOpenAIKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update OpenAI Key
                </button>
              </div>
            </div>

            {/* Widget Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Widget Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Installation Code */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Installation Code</h2>
              <p className="text-sm text-gray-600 mb-4">
                Copy this code and paste it before the closing &lt;/body&gt; tag on your website.
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(embedCode, setCopiedCode)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  {copiedCode ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
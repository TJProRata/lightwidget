import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from '../components/auth/SignOutButton';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);
  const initializeUser = useMutation(api.users.initializeUser.initializeUser);
  const updateSettings = useMutation(api.users.updateWidgetSettings.updateWidgetSettings);

  const [formData, setFormData] = useState({
    domain: '',
    theme: 'light',
    position: 'bottom-center',
    brandColor: '#C081FF'
  });

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize user on first load if needed
  useEffect(() => {
    if (currentUser && !currentUser.apiKey) {
      initializeUser().catch(console.error);
    }
  }, [currentUser, initializeUser]);

  // Update form when user data loads
  useEffect(() => {
    if (currentUser) {
      setFormData({
        domain: currentUser.domain || '',
        theme: currentUser.settings?.theme || 'light',
        position: currentUser.settings?.position || 'bottom-center',
        brandColor: currentUser.settings?.brandColor || '#C081FF'
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        domain: formData.domain,
        theme: formData.theme,
        position: formData.position,
        brandColor: formData.brandColor,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const embedCode = currentUser?.apiKey
    ? `<script>
  window.LightWidgetConfig = {
    apiKey: '${currentUser.apiKey}',
    position: '${formData.position}',
    theme: '${formData.theme}'
  };
</script>
<script src="https://lightwidget.vercel.app/loader.js" async></script>`
    : 'Loading...';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const demoUrl = currentUser?._id ? `/demo/${currentUser._id}` : '';

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                LightWidget
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{currentUser.email}</span>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Widget Configuration</h1>
            <p className="text-gray-600">Customize your AI chat widget and embed it on your website</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>

              <div className="space-y-6">
                {/* Domain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Domain
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    placeholder="example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty during testing. Widget will only work on this domain when set.
                  </p>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                  </select>
                </div>

                {/* Brand Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="brandColor"
                      value={formData.brandColor}
                      onChange={handleInputChange}
                      className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      name="brandColor"
                      value={formData.brandColor}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>

            {/* Preview & Embed Code */}
            <div className="space-y-6">
              {/* Live Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
                <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] relative">
                  <p className="text-sm text-gray-500 text-center">
                    Widget preview will appear here based on your settings
                  </p>
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: formData.brandColor }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embed Code */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Embed Code</h2>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-sm text-green-400 break-all">
                    {embedCode}
                  </code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy Code'}
                </button>
                <p className="mt-3 text-sm text-gray-600">
                  Add this code to your website's HTML, right before the closing <code>&lt;/body&gt;</code> tag
                </p>
              </div>

              {/* Demo Link */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Test Your Widget</h2>
                <p className="text-gray-600 mb-4">
                  See your widget in action on our demo page
                </p>
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-purple-600 text-white text-center font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  View Demo Page
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
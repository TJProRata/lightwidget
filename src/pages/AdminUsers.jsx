import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from '../components/auth/SignOutButton';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const navigate = useNavigate();
  const users = useQuery(api.users.getAllUsers.getAllUsers);
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!users) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                LightWidget Admin
              </span>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/science')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Playground
            </button>
            <span className="text-sm text-gray-600">{currentUser?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">
            Total Users: <span className="font-semibold">{users.length}</span>
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || 'User'}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user._id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.email || 'No email'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.domain || (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(user.plan)}`}>
                          {user.plan || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/demo/${user._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          View Demo
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Active Users</div>
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Free Plan</div>
            <div className="text-3xl font-bold text-gray-600">
              {users.filter(u => u.plan === 'free').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Pro Plan</div>
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.plan === 'pro').length}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
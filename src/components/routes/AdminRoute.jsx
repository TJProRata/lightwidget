import React from 'react';
import { Navigate } from 'react-router-dom';
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ADMIN_EMAILS = ["email@prorata.ai", "tj@prorata.ai"];

export function AdminRoute({ children }) {
  const currentUser = useQuery(api.users.currentUser.getCurrentUser);

  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  return (
    <>
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
              <p className="mt-4 text-gray-600">Verifying permissions...</p>
            </div>
          </div>
        ) : isAdmin ? (
          // User is admin, show children
          children
        ) : (
          // User is authenticated but not admin, redirect to dashboard
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center max-w-md px-6">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Admin access is required.
              </p>
              <Navigate to="/dashboard" replace />
            </div>
          </div>
        )}
      </Authenticated>

      <Unauthenticated>
        <Navigate to="/" replace />
      </Unauthenticated>
    </>
  );
}
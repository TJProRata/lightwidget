import React from 'react';
import { Navigate } from 'react-router-dom';
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export function ProtectedRoute({ children }) {
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
        {children}
      </Authenticated>

      <Unauthenticated>
        <Navigate to="/" replace />
      </Unauthenticated>
    </>
  );
}
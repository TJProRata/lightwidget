import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://your-convex-instance.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </React.StrictMode>
);
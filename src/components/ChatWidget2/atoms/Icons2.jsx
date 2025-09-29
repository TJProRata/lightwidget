import React from 'react';

export const TrendingArrow = ({ className = "" }) => (
  <div className={`trending-arrow ${className}`}>
    ↗
  </div>
);

export const SearchIcon = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 text-white ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
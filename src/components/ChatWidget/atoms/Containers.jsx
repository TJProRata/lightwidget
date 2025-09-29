import React from 'react';

export const GlassContainer = ({ children, className = "" }) => (
  <div className={`glass-container ${className}`}>
    {children}
  </div>
);

export const IconButton = ({ 
  children, 
  onClick, 
  className = "",
  disabled = false 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      icon-button
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
      ${className}
    `}
  >
    {children}
  </button>
);
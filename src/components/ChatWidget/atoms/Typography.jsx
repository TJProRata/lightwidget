import React from 'react';

export const Text = ({
  children,
  variant = 'body',
  className = ""
}) => {
  const variants = {
    heading: 'cw1-text-heading text-lg font-bold',
    body: 'cw1-text-body text-md',
    caption: 'cw1-text-caption text-sm',
    button: 'cw1-text-button text-md font-medium'
  };

  // Add inline style as fallback to ensure text is always visible
  const fallbackStyle = {
    color: 'white'
  };

  return (
    <span className={`${variants[variant]} ${className}`} style={fallbackStyle}>
      {children}
    </span>
  );
};

export const SearchingText = ({ 
  text, 
  isAnimating = false,
  className = "" 
}) => (
  <div className={`searching-text ${isAnimating ? 'animate-pulse' : ''} ${className}`}>
    <Text variant="body" className="text-white">
      Searching through <span className="font-semibold">{text}</span>...
    </Text>
  </div>
);
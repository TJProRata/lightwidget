import React from 'react';

export const Text2 = ({
  children,
  variant = 'body',
  className = ""
}) => {
  const variants = {
    heading: 'text-lg font-bold text-white',
    body: 'text-md text-white',
    caption: 'text-sm text-white',
    counter: 'text-5xl font-bold bg-gradient-to-r from-orange-400 via-purple-400 to-purple-500 bg-clip-text text-transparent'
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const CounterText = ({
  value,
  className = ""
}) => (
  <div className={`counter-number ${className}`}>
    {value}
  </div>
);
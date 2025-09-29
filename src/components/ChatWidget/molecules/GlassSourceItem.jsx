import React from 'react';

export const GlassSourceItem = ({
  logo,
  percentage,
  isExpanded,
  backgroundColor,
  width,
  onClick,
}) => {
  const isImageUrl = typeof logo === 'string' && logo.includes('/');

  return (
    <button
      className="glass-source-item"
      style={{
        backgroundColor,
        width: `${width}px`,
      }}
      onClick={onClick}
    >
      {/* Glass morphism overlay */}
      <div className="glass-overlay" />
      
      {/* Border effect */}
      <div className="glass-border" />

      {/* Logo */}
      <div 
        className="source-logo"
        style={{
          right: isExpanded ? '42px' : '8px',
        }}
      >
        {isImageUrl ? (
          <img src={logo} alt="Source" className="source-logo-image" />
        ) : (
          <span className="source-logo-text">{logo}</span>
        )}
      </div>

      {/* Percentage */}
      {percentage && (
        <span 
          className="source-percentage"
          style={{
            opacity: isExpanded ? 1 : 0,
          }}
        >
          {percentage}
        </span>
      )}
    </button>
  );
};
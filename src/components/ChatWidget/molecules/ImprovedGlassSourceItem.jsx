import React from 'react';

export const ImprovedGlassSourceItem = ({
  logo,
  percentage,
  isExpanded,
  showPercentage,
  backgroundColor,
  width,
  onClick,
}) => {
  // Check if logo is an image (imported images or URLs)
  const isImageUrl = typeof logo === 'string' && (logo.includes('/') || logo.includes('.png') || logo.includes('.jpg') || logo.includes('.svg'));

  // Use white border for all source pills
  const getBorderColor = () => {
    return 'rgba(255, 255, 255, 0.3)'; // White with 30% opacity
  };

  return (
    <button
      className="improved-glass-source-item"
      style={{
        backgroundColor,
        width: `${width}px`,
        border: `1px solid ${getBorderColor()}`,
      }}
      onClick={onClick}
    >
      {/* Glass morphism overlay */}
      <div className="improved-glass-overlay" />

      {/* Border effect - removed since we're applying inline */}
      {/* <div className="improved-glass-border" /> */}

      {/* Logo */}
      <div 
        className="improved-source-logo"
        style={{
          right: isExpanded ? '42px' : '8px',
        }}
      >
        {isImageUrl ? (
          <img src={logo} alt="Source" className="improved-source-logo-image" />
        ) : (
          <span className="improved-source-logo-text">{logo}</span>
        )}
      </div>

      {/* Percentage */}
      {percentage && (
        <span 
          className="improved-source-percentage"
          style={{
            opacity: showPercentage ? 1 : 0,
          }}
        >
          {percentage}
        </span>
      )}
    </button>
  );
};
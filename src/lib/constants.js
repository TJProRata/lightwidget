// Widget State Constants
export const CONTENT_STATES = {
  IDLE: 'idle',
  TYPING: 'typing', 
  SEARCHING: 'searching',
  RESULTS: 'results',
  ERROR: 'error'
};

export const LAYOUT_STATES = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
};

// Design Tokens
export const DESIGN_TOKENS = {
  colors: {
    primary: '#C081FF',
    secondary: '#B8FFE3',
    background: 'rgba(0, 0, 0, 0.05)',
    text: {
      primary: '#000000',
      secondary: '#666666'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.15)'
    }
  },
  spacing: {
    sm: '8px',
    md: '16px', 
    lg: '24px',
    xl: '32px'
  },
  typography: {
    sizes: {
      sm: '14px',
      md: '16px',
      lg: '24px'
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  },
  dimensions: {
    compactButton: {
      width: '103.18px',
      height: '51px'
    },
    expandedContainer: {
      width: '400px',
      minHeight: '500px'
    }
  }
};

// Animation Constants
export const ANIMATIONS = {
  fadeIn: 'fadeIn 0.3s ease-out',
  slideUp: 'slideUp 0.4s ease-out',
  scaleIn: 'scaleIn 0.2s ease-out',
  gradient: 'gradient 3s ease infinite'
};
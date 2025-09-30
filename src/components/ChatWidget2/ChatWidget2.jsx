import React from 'react';
import { AskAIContainer } from './organisms/TrendingDropdown';
import './ChatWidget2.css';

export const ChatWidget2 = ({
  position = 'bottom-center',
  config = {}
}) => {
  const positionStyles = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'bottom-center': { bottom: '24px', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' },
    'top-center': { top: '24px', left: '50%', transform: 'translateX(-50%)' }
  };

  const widgetStyle = {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    pointerEvents: 'auto'
  };

  return (
    <div className="cw2-widget-wrapper" style={widgetStyle}>
      <AskAIContainer config={config} />
    </div>
  );
};
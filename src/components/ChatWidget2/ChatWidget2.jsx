import React from 'react';
import { AskAIContainer } from './organisms/TrendingDropdown';
import './ChatWidget2.css';

export const ChatWidget2 = ({
  position = 'bottom-center',
  config = {}
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`cw2-widget-wrapper fixed ${positionClasses[position]} z-50`}>
      <AskAIContainer config={config} />
    </div>
  );
};
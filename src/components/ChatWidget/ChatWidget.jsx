import React from 'react';
import { MainFlowAnimated } from './templates/MainFlowAnimated';
import './ChatWidget.css';

export const ChatWidget = ({ 
  initialExpanded = false,
  position = 'bottom-center'
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
    <div className={`cw1-widget-wrapper fixed ${positionClasses[position]} z-50`}>
      <MainFlowAnimated initialExpanded={initialExpanded} />
    </div>
  );
};
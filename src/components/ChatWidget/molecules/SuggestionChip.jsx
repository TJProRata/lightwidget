import React from 'react';
import { Text } from '../atoms/Typography';
import StarsIcon from '../../../assets/stars.svg';

export const SuggestionChip = ({
  text,
  onClick,
  className = ""
}) => (
  <button
    onClick={() => onClick(text)}
    className={`cw1-suggestion-chip ${className}`}
  >
    <img src={StarsIcon} alt="Stars" className="w-4 h-4 mr-2" />
    <Text variant="body" className="text-white">
      {text}
    </Text>
  </button>
);

export const SuggestionItem = ({ 
  text, 
  onClick,
  className = "" 
}) => (
  <div
    onClick={() => onClick(text)}
    className={`cw1-suggestion-item ${className}`}
  >
    <Text variant="body" className="text-white">
      {text}
    </Text>
  </div>
);
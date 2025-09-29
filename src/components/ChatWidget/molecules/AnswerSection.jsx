import React, { useState } from 'react';
import { Text } from '../atoms/Typography';
import { RefreshIcon } from '../atoms/Icons';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

export const AnswerText = ({ 
  text, 
  isExpanded = false,
  onToggleExpand,
  className = "" 
}) => {
  const shouldTruncate = text.length > 150 && !isExpanded;
  const displayText = shouldTruncate ? text.substring(0, 150) + '...' : text;

  return (
    <div className={`answer-text ${className}`}>
      <Text variant="body" className="text-white leading-relaxed">
        {displayText}
      </Text>
      {text.length > 150 && (
        <button
          onClick={onToggleExpand}
          className="expand-toggle-btn mt-2"
        >
          <Text variant="caption" className="text-blue-300 hover:text-blue-200">
            {isExpanded ? 'Show less' : 'Show more'}
          </Text>
        </button>
      )}
    </div>
  );
};

export const ReactionButtons = ({ onReaction }) => (
  <div className="reaction-buttons">
    <button
      onClick={() => onReaction('like')}
      className="reaction-btn"
    >
      <ThumbsUp className="w-4 h-4" />
    </button>
    <button
      onClick={() => onReaction('dislike')}
      className="reaction-btn"
    >
      <ThumbsDown className="w-4 h-4" />
    </button>
    <button
      onClick={() => onReaction('copy')}
      className="reaction-btn"
    >
      <Copy className="w-4 h-4" />
    </button>
  </div>
);
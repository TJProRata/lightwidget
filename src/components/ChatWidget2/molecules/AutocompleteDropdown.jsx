import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlusIcon from '../../../assets/PlusIcon.svg';
import { TrendingSearchItem } from './TrendingQuestion';

const AUTOCOMPLETE_SUGGESTIONS = [
  "When is the new episode of Wednesday?",
  "Best shows on Netflix today",
  "What is the orange trend?",
  "Latest AI technology news",
  "How to make chocolate cookies",
  "Best restaurants near me",
  "Weather forecast this weekend",
  "Stock market updates",
  "Popular movies this month",
  "Health benefits of water",
  // Test suggestions that will match anything
  "Search for anything",
  "Find any information",
  "Ask about any topic",
  "Get quick answers"
];

export const AutocompleteDropdown = ({
  searchValue,
  onSuggestionSelect,
  isVisible = false,
  onSuggestionCountChange
}) => {
  const filteredSuggestions = AUTOCOMPLETE_SUGGESTIONS.filter(suggestion =>
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  );

  // If no matches found, show some default suggestions
  const suggestionsToShow = filteredSuggestions.length > 0
    ? filteredSuggestions.slice(0, 3)
    : AUTOCOMPLETE_SUGGESTIONS.slice(-3); // Show last 3 as fallback

  // Notify parent of suggestion count changes
  useEffect(() => {
    if (onSuggestionCountChange && searchValue.trim()) {
      onSuggestionCountChange(suggestionsToShow.length);
    }
  }, [suggestionsToShow.length, searchValue, onSuggestionCountChange]);

  if (!searchValue.trim()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cw2-autocomplete-dropdown"
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            height: 'auto',
            transition: {
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
          exit={{
            opacity: 0,
            y: 10,
            height: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }}
        >
          {suggestionsToShow.map((suggestion, index) => {
            const mockCounts = ['27.0k', '18.0k', '1.8k'];
            return (
              <TrendingSearchItem
                key={index}
                text={suggestion}
                count={mockCounts[index] || '1.0k'}
                onClick={() => onSuggestionSelect(suggestion)}
                index={index}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
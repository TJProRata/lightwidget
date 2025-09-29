import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '../atoms/Icons';

const AUTOCOMPLETE_SUGGESTIONS = [
  "What's the latest news today?",
  "Tell me about climate change",
  "How does AI work?",
  "What are the stock market trends?",
  "Explain quantum computing",
  "What's happening in politics?",
  "Latest technology breakthroughs",
  "Health and wellness tips",
  "Travel recommendations",
  "Recipe suggestions",
  "Movie recommendations",
  "Book suggestions",
  "Learning resources",
  "Career advice",
  "Financial planning tips"
];

export const AutocompleteDropdown = ({
  searchValue,
  onSuggestionSelect,
  isVisible = false,
  onSuggestionCountChange
}) => {
  // Filter suggestions based on search value
  const filteredSuggestions = searchValue.trim()
    ? AUTOCOMPLETE_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  // If no matches found, show some default suggestions
  const suggestionsToShow = filteredSuggestions.length > 0
    ? filteredSuggestions.slice(0, 4)
    : searchValue.trim() ? AUTOCOMPLETE_SUGGESTIONS.slice(0, 3) : [];

  // Notify parent of suggestion count changes
  useEffect(() => {
    if (onSuggestionCountChange && searchValue.trim()) {
      onSuggestionCountChange(suggestionsToShow.length);
    } else if (onSuggestionCountChange && !searchValue.trim()) {
      onSuggestionCountChange(0);
    }
  }, [suggestionsToShow.length, searchValue, onSuggestionCountChange]);

  if (!searchValue.trim() || !isVisible) return null;

  return (
    <AnimatePresence>
      {suggestionsToShow.length > 0 && (
        <motion.div
          className="cw1-autocomplete-dropdown"
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
          {suggestionsToShow.map((suggestion, index) => (
            <motion.div
              key={index}
              className="cw1-autocomplete-item"
              onClick={() => onSuggestionSelect(suggestion)}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: index * 0.05,
                  duration: 0.2
                }
              }}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.99 }}
            >
              <PlusIcon className="cw1-autocomplete-icon" />
              <span className="cw1-autocomplete-text">{suggestion}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
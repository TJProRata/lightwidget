import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '../../../assets/PlusIcon.svg';
import MicIcon from '../../../assets/micicon.svg';
import EllipseIcon from '../../../assets/Ellipse 3.svg';

export const SearchBar = ({
  placeholder = "Ask anything",
  onSubmit,
  onVoiceRecord,
  onFocus,
  onInputChange
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus management for better text visibility
  useEffect(() => {
    if (inputRef.current && query.length > 0) {
      // Set selection to end of text to ensure cursor is visible
      const length = query.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSubmit) {
      onSubmit(query);
    }
  };

  const handleVoiceRecord = () => {
    if (onVoiceRecord) {
      onVoiceRecord();
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.form
      variants={itemVariants}
      className="cw2-search-bar-container"
      onSubmit={handleSubmit}
    >
      <img src={PlusIcon} alt="Plus" className="cw2-plus-icon" />

      <div className="cw2-search-input-container" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          className="cw2-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onInputChange) {
              onInputChange(e.target.value);
            }
          }}
          onFocus={handleFocus}
        />
      </div>

      <button
        type="button"
        className="cw2-mic-button"
        onClick={handleVoiceRecord}
      >
        <img src={MicIcon} alt="Microphone" className="cw2-mic-icon" />
      </button>

      <button
        type="submit"
        className="cw2-submit-button"
      >
        <img src={EllipseIcon} alt="Submit" className="cw2-submit-icon" />
      </button>
    </motion.form>
  );
};
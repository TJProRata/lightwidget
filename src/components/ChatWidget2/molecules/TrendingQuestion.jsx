import React from 'react';
import { motion } from 'framer-motion';
import OrangeStars from '../../../assets/orangestars.svg';
import SwapIcon from '../../../assets/Swap icon.svg';
import TrendIcon from '../../../assets/trend.svg';

export const TrendingSearchItem = ({
  text,
  count,
  onClick,
  className = "",
  index = 0
}) => {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth bezier curve
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div
      className={`cw2-trending-search-item ${className}`}
      style={{
        '--animation-delay': `${index * 0.6 + 0.7}s`,
        '--fill-percentage': index === 0 ? '1' : index === 1 ? '0.6' : '0.35'
      }}
      onClick={() => onClick && onClick(text)}
    >
      <div className="cw2-trending-search-left">
        <img src={OrangeStars} alt="Stars" className="cw2-location-pin" />
        <span className="cw2-trending-text">{text}</span>
      </div>

      <div className="cw2-trending-count">
        <img src={TrendIcon} alt="Trend" className="cw2-trending-icon" />
        <span className="cw2-count-text">{count}</span>
      </div>
    </div>
  );
};

export const ExpandButton = ({
  text = "Other Trending Searches",
  isExpanded = false,
  onClick,
  className = ""
}) => {
  const itemVariants = {
    hidden: {
      y: 15,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 0.5
      }
    },
    exit: {
      y: -15,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      variants={itemVariants}
      className={`cw2-expand-button ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="cw2-expand-text">{text}</span>
      <img src={SwapIcon} alt="Swap" className={`cw2-swap-icon ${isExpanded ? 'cw2-expanded' : ''}`} />
    </motion.button>
  );
};
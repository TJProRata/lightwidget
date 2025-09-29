import React from 'react';
import { motion } from 'framer-motion';
import { NYTLogo } from '../atoms/Icons';
import StarsIcon from '../../../assets/stars.svg';
import MoreIcon from '../../../assets/Layer_1.svg';
import { Text } from '../atoms/Typography';

export const CompactButton = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="compact-button gradient-border"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
  >
    <div className="flex items-center space-x-1.5">
      <img src={StarsIcon} alt="Stars" className="w-4 h-4" />
      <Text variant="button" className="text-white text-sm font-medium">Ask</Text>
      <NYTLogo className="w-6 h-6" />
    </div>
  </motion.button>
);

export const ExpandButton = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`expand-button ${className}`}
  >
    {children}
  </button>
);

export const MoreButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="more-button"
  >
    <img src={MoreIcon} alt="More" className="w-4 h-4 mr-2" />
    <Text variant="button" className="text-white">More</Text>
  </button>
);
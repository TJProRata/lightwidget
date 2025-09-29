import React from 'react';
import { Plus, Mic, Sparkles, Search, RotateCcw } from 'lucide-react';
import TNFavicon from '../../../assets/TNfavicon.png';

export const PlusIcon = ({ className = "w-4 h-4" }) => (
  <Plus className={className} />
);

export const MicIcon = ({ className = "w-4 h-4" }) => (
  <Mic className={className} />
);

export const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <Sparkles className={className} />
);

export const SearchIcon = ({ className = "w-4 h-4" }) => (
  <Search className={className} />
);

export const RefreshIcon = ({ className = "w-4 h-4" }) => (
  <RotateCcw className={className} />
);

export const NYTLogo = ({ className = "w-8 h-8" }) => (
  <img
    src={TNFavicon}
    alt="TechNews Today"
    className={className}
    style={{
      objectFit: 'contain',
      flexShrink: 0
    }}
  />
);
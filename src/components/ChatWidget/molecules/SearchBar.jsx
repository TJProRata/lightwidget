import React from 'react';
import { PlusIcon, MicIcon, NYTLogo } from '../atoms/Icons';

export const SearchBar = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  placeholder = "Ask Anything",
  readOnly = false,
  className = ""
}) => (
  <div className={`cw1-search-bar gradient-border ${className}`}>
    <PlusIcon className="w-4 h-4 text-white ml-4 flex-shrink-0" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      readOnly={readOnly}
      className="cw1-search-input"
    />
    <div className="flex items-center space-x-3 mr-4">
      <MicIcon className="w-4 h-4 text-white cursor-pointer hover:text-gray-300 flex-shrink-0" />
      <NYTLogo className="w-8 h-8 flex-shrink-0" />
    </div>
  </div>
);
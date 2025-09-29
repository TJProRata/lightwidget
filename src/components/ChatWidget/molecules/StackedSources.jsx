import React, { useState, useEffect } from 'react';
import { GlassSourceItem } from './GlassSourceItem';

export const StackedSources = ({ sources, onSourceClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-expand after 1 second and stop loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Widths for each source item
  const collapsedWidths = [40, 73, 106, 140];
  const expandedWidths = [73, 146, 212, 284];

  if (isLoading) {
    return (
      <div className="loading-sources">
        <span className="loading-text">Loading sources...</span>
      </div>
    );
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="stacked-sources-container"
    >
      {sources.map((source, index) => {
        const zIndex = sources.length - index;
        const width = (isExpanded || isHovered)
          ? expandedWidths[index]
          : collapsedWidths[index];

        return (
          <div
            key={source.id}
            className="source-item-wrapper"
            style={{
              zIndex,
              transition: 'left 0.3s ease-out',
            }}
          >
            <GlassSourceItem
              logo={source.logo}
              percentage={source.percentage}
              backgroundColor={source.color}
              isExpanded={isExpanded || isHovered}
              width={width}
              onClick={() => {
                if (source.url) window.open(source.url, '_blank');
                onSourceClick?.(source);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
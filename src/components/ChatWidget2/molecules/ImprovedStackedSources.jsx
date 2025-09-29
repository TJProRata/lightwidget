import React, { useState, useEffect } from 'react';
import { ImprovedGlassSourceItem } from './ImprovedGlassSourceItem';

export const ImprovedStackedSources = ({ sources, onSourceClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPercentages, setShowPercentages] = useState(false);

  // Show percentages with slight delay when hovering
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setShowPercentages(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowPercentages(false);
    }
  }, [isHovered]);

  // Stacked widths for the "staircase" effect - supports up to 4 sources
  const collapsedWidths = [40, 73, 106, 140];
  const expandedWidths = [73, 146, 212, 284];

  const shouldExpand = isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowPercentages(false);
      }}
      className="cw2-improved-stacked-sources-container"
    >
      {sources.map((source, index) => {
        const zIndex = sources.length - index; // Top item has highest z-index
        const width = shouldExpand ? expandedWidths[index] : collapsedWidths[index];

        return (
          <div
            key={source.id}
            className="cw2-improved-source-wrapper"
            style={{
              zIndex,
            }}
          >
            <ImprovedGlassSourceItem
              logo={source.logo}
              percentage={source.percentage}
              backgroundColor={source.color}
              isExpanded={shouldExpand}
              showPercentage={shouldExpand && showPercentages}
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
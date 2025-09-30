import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SearchBar } from '../molecules/SearchBar';
import { TrendingSearchItem, ExpandButton } from '../molecules/TrendingQuestion';
import { AutocompleteDropdown } from '../molecules/AutocompleteDropdown';
import { ImprovedStackedSources } from '../molecules/ImprovedStackedSources';
import AISearchIcon from '../../../assets/.ai-search.svg';
import StarsIcon from '../../../assets/stars.svg';
import ClockIcon from '../../../assets/clock.svg';
import { CONTENT_STATES } from '../../../lib/constants';
import { SEARCHING_CONTENT } from '../../../lib/mockData';

const TRENDING_SEARCHES = [
  { text: "When is the new episode of", targetCount: 27000, displayCount: "27.0k" },
  { text: "Best shows today", targetCount: 18000, displayCount: "18.0k" },
  { text: "What is the orange trend?", targetCount: 1800, displayCount: "1.8k" }
];

const EXPANDED_SEARCHES = [
  { text: "Technology updates", count: "15.2k" },
  { text: "Climate change news", count: "8.9k" },
  { text: "Sports scores", count: "22.1k" },
  { text: "Stock market trends", count: "31.5k" }
];

export const AskAIContainer = ({ config = {} }) => {
  // Generate session ID
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`).current;

  // Extract apiKey and userId from config
  const apiKey = config.apiKey;
  const userId = config.userId || sessionId; // Use userId from config if available, otherwise use sessionId

  // Convex hooks
  const sendMessage = useMutation(api.messages.sendMessage);
  const addToPromptHistory = useMutation(api.chat.addToPromptHistory);
  const deleteBranch = useMutation(api.messages.deleteBranch);
  const clearAllMessages = useMutation(api.messages.clearAllMessages);
  const clearAllChatTabs = useMutation(api.chat.clearAllChatTabs);
  const clearAllPromptHistory = useMutation(api.chat.clearAllPromptHistory);
  const generateAnswer = useAction(api.openai.generateAnswer);
  const generateAnswerWithContext = useAction(api.openai.generateAnswerWithContext);
  const storeWebpageContent = useMutation(api.webpage.storeWebpageContent);
  const storeWebpageContentWithApiKey = useMutation(api.webpage.storeWebpageContentWithApiKey);
  const clearAllWebpageContent = useMutation(api.webpage.clearAllWebpageContent);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showTrendingSearches, setShowTrendingSearches] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [counters, setCounters] = useState(TRENDING_SEARCHES.map(() => 0));
  const [animationKey, setAnimationKey] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const containerRef = useRef(null);

  // 3-phase flow state
  const [contentState, setContentState] = useState(CONTENT_STATES.IDLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchStatusVisible, setSearchStatusVisible] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [showPromptHistory, setShowPromptHistory] = useState(false);

  // Computed state helpers
  const isIdle = contentState === CONTENT_STATES.IDLE;
  const isSearching = contentState === CONTENT_STATES.SEARCHING;
  const isResults = contentState === CONTENT_STATES.RESULTS;

  // Clear data on mount and capture webpage content
  useEffect(() => {
    // Clear all data including webpage content
    Promise.all([
      clearAllMessages(),
      clearAllChatTabs(),
      clearAllPromptHistory(),
      clearAllWebpageContent()
    ]).catch(error => {
      console.error("Failed to clear data on page load:", error);
    });

    // Capture and store webpage content
    const capturePageContent = async () => {
      try {
        const url = window.location.href;
        const title = document.title;

        // Smart content extraction - target main content areas
        let content = '';

        // Try to find main content areas in order of preference
        const contentSelectors = [
          'main',
          'article',
          '[role="main"]',
          '#main',
          '.main',
          '#content',
          '.content',
          '.post-content',
          '.entry-content',
          '.article-content'
        ];

        let mainContent = null;
        for (const selector of contentSelectors) {
          mainContent = document.querySelector(selector);
          if (mainContent) break;
        }

        if (mainContent) {
          // If we found a main content area, extract from there
          content = mainContent.innerText;
        } else {
          // Fallback: Get body text but try to exclude common boilerplate
          const body = document.body.cloneNode(true);

          // Remove common boilerplate elements
          const selectorsToRemove = [
            'nav', 'header', 'footer', 'aside',
            '.nav', '.navigation', '.header', '.footer', '.sidebar',
            '#nav', '#navigation', '#header', '#footer', '#sidebar',
            '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
            '.cookie-banner', '.advertisement', '.ads', '.ad'
          ];

          selectorsToRemove.forEach(selector => {
            body.querySelectorAll(selector).forEach(el => el.remove());
          });

          content = body.innerText;
        }

        const htmlSnippet = document.body.innerHTML.substring(0, 1000);

        // Use new mutation that validates API key
        if (apiKey) {
          await storeWebpageContentWithApiKey({
            url,
            title,
            content,
            htmlSnippet,
            sessionId: userId,  // userId in widget is actually a session string
            apiKey: apiKey
          });
        } else {
          // Fallback to legacy mutation for development
          await storeWebpageContent({
            url,
            title,
            content,
            htmlSnippet,
            sessionId: userId  // userId in widget is actually a session string
          });
        }

        console.log("Webpage content captured:", {
          url,
          title,
          contentLength: content.length,
          extractionMethod: mainContent ? `Found main content: ${mainContent.tagName}` : 'Fallback method'
        });
      } catch (error) {
        console.error("Failed to capture webpage content:", error);
      }
    };

    capturePageContent();
  }, [clearAllMessages, clearAllChatTabs, clearAllPromptHistory, clearAllWebpageContent, storeWebpageContent, storeWebpageContentWithApiKey, sessionId, apiKey]);

  // Searching animation
  useEffect(() => {
    if (!isSearching) return;

    const interval = setInterval(() => {
      setSearchStatusVisible(false);
      setTimeout(() => {
        setCurrentSearchIndex((prev) => (prev + 1) % SEARCHING_CONTENT.length);
        setSearchStatusVisible(true);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, [isSearching]);

  useEffect(() => {
    if (!isExpanded) return;

    // Animation sequence only runs when expanded
    const searchBarTimer = setTimeout(() => {
      setShowSearchBar(true);
    }, 200);

    const trendingTimer = setTimeout(() => {
      setShowTrendingSearches(true);

      // Start counter animations after stagger completes
      TRENDING_SEARCHES.forEach((search, index) => {
        const delay = 600 + (index * 100); // Shorter delay, optimized timing
        setTimeout(() => {
          const duration = 2000; // 2 seconds to count up
          const steps = 60; // 60 steps for smooth animation
          const increment = search.targetCount / steps;
          let currentStep = 0;

          const counterInterval = setInterval(() => {
            currentStep++;
            const currentValue = Math.min(currentStep * increment, search.targetCount);

            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = currentValue;
              return newCounters;
            });

            if (currentStep >= steps) {
              clearInterval(counterInterval);
            }
          }, duration / steps);
        }, delay);
      });
    }, 600);

    const expandButtonTimer = setTimeout(() => {
      setShowExpandButton(true);
    }, 1000);

    return () => {
      clearTimeout(searchBarTimer);
      clearTimeout(trendingTimer);
      clearTimeout(expandButtonTimer);
    };
  }, [isExpanded]);

  // Click outside to collapse (handles both iframe clicks and parent page clicks)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && isExpanded) {
        if (isSearchFocused) {
          // If search is focused, go back to expanded state
          setIsSearchFocused(false);
        } else {
          // If expanded, collapse completely
          setIsExpanded(false);
          setShowSearchBar(false);
          setShowTrendingSearches(false);
          setShowExpandButton(false);
          setCounters(TRENDING_SEARCHES.map(() => 0));
          // Reset search and autocomplete
          setSearchValue('');
          setShowAutocomplete(false);
          // Reset content state
          setContentState(CONTENT_STATES.IDLE);
          setResults(null);
          setSearchQuery('');
        }
      }
    };

    const handleParentClickOutside = (event) => {
      // Handle messages from parent window (clicks outside iframe)
      if (event.data && event.data.type === 'CLICK_OUTSIDE' && isExpanded) {
        if (isSearchFocused) {
          setIsSearchFocused(false);
        } else {
          // Collapse widget
          setIsExpanded(false);
          setShowSearchBar(false);
          setShowTrendingSearches(false);
          setShowExpandButton(false);
          setCounters(TRENDING_SEARCHES.map(() => 0));
          setSearchValue('');
          setShowAutocomplete(false);
          setContentState(CONTENT_STATES.IDLE);
          setResults(null);
          setSearchQuery('');
        }
      }
    };

    if (isExpanded) {
      // Listen for clicks inside the iframe
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Listen for messages from parent window
      window.addEventListener('message', handleParentClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('message', handleParentClickOutside);
    };
  }, [isExpanded, isSearchFocused]);

  const handleSearchSubmit = async (query) => {
    if (!query || !query.trim()) return;

    setSearchQuery(query);
    setSearchValue(query);
    setContentState(CONTENT_STATES.SEARCHING);
    setIsSearchFocused(false);
    setShowAutocomplete(false);

    // Check if we're branching from a previous message
    const isBranching = activeTabId !== null && activeTabId < conversationHistory.length - 1;

    if (isBranching) {
      // Delete the branch in Convex database
      const currentMessage = conversationHistory[activeTabId];
      if (currentMessage && currentMessage._id) {
        await deleteBranch({
          fromMessageId: currentMessage._id,
          userId: userId
        });
      }

      // Truncate local history at the branch point
      setConversationHistory(prev => prev.slice(0, activeTabId + 1));
    }

    // Add to prompt history
    await addToPromptHistory({
      title: query.length > 50 ? query.substring(0, 50) + '...' : query,
      query: query
    });

    // Call OpenAI via Convex action
    try {
      // Calculate sequence number based on current position
      const newSequenceNumber = isBranching ? activeTabId + 1 : conversationHistory.length;

      // Call OpenAI action with webpage context (this also saves to database)
      const response = await generateAnswerWithContext({
        query: query,
        userId: userId,
        sequenceNumber: newSequenceNumber,
        conversationPath: newSequenceNumber.toString(),
        url: window.location.href,
        apiKey: apiKey
      });

      // Create display version with transformed sources for stacked display
      const sourceColors = [
        '#E19736',
        '#9676D9',
        '#C081FF',
        '#B8FFE3'
      ];

      const displayResult = {
        _id: response._id,
        query: query,
        answer: response.answer,
        sources: [
          {
            id: 'tech',
            name: 'Technology',
            logo: 'T',
            color: sourceColors[0],
            percentage: '35%'
          },
          {
            id: 'biz',
            name: 'Business',
            logo: 'B',
            color: sourceColors[1],
            percentage: '30%'
          },
          {
            id: 'sci',
            name: 'Science',
            logo: 'S',
            color: sourceColors[2],
            percentage: '20%'
          },
          {
            id: 'design',
            name: 'Design',
            logo: 'D',
            color: sourceColors[3],
            percentage: '15%'
          }
        ],
        suggestions: [
          'Tell me more',
          'Related topics',
          'Latest updates'
        ]
      };

      setConversationHistory(prev => [...prev, displayResult]);
      setResults(displayResult);
      setActiveTabId(newSequenceNumber);
      setContentState(CONTENT_STATES.RESULTS);
      setSearchValue('');
    } catch (error) {
      console.error("Error generating answer:", error);
      setContentState(CONTENT_STATES.IDLE);
      // Show error message to user
      alert('Failed to generate answer. Please check your OpenAI API key configuration.');
    }
  };

  const handleVoiceRecord = () => {
    console.log('Voice recording started');
  };

  const handleTrendingClick = (searchText) => {
    handleSearchSubmit(searchText);
  };

  const handleCollapsedClick = () => {
    setIsExpanded(true);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleInputChange = (value) => {
    console.log('Input changed:', value);
    setSearchValue(value);
    setShowAutocomplete(value.trim().length > 0);
    console.log('Show autocomplete:', value.trim().length > 0);
  };

  const handleAutocompleteSelect = (suggestion) => {
    setSearchValue(suggestion);
    setShowAutocomplete(false);
    setIsSearchFocused(true); // Trigger the focused phase
    console.log('Autocomplete suggestion selected:', suggestion);
  };

  const handleSuggestionCountChange = (count) => {
    setSuggestionCount(count);
  };

  const handleExpandClick = () => {
    // Reset and restart the staggered animation
    setShowTrendingSearches(false);
    setCounters(TRENDING_SEARCHES.map(() => 0));
    setAnimationKey(prev => prev + 1);

    setTimeout(() => {
      setShowTrendingSearches(true);

      // Restart counter animations after stagger completes
      TRENDING_SEARCHES.forEach((search, index) => {
        const delay = 600 + (index * 100); // Shorter delay, optimized timing
        setTimeout(() => {
          const duration = 2000;
          const steps = 60;
          const increment = search.targetCount / steps;
          let currentStep = 0;

          const counterInterval = setInterval(() => {
            currentStep++;
            const currentValue = Math.min(currentStep * increment, search.targetCount);

            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = currentValue;
              return newCounters;
            });

            if (currentStep >= steps) {
              clearInterval(counterInterval);
            }
          }, duration / steps);
        }, delay);
      });
    }, 100);
  };

  const formatCounter = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return Math.floor(num).toString();
  };

  // Memoized variants for performance
  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }), []);

  const headerVariants = {
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

  // Calculate container dimensions based on state
  const getContainerHeight = () => {
    if (!isExpanded) return 48; // Collapsed

    // In RESULTS state
    if (isResults) {
      if (isSearchFocused) {
        // When typing follow-up, use same compact height as IDLE focused
        return showAutocomplete ? (70 + (suggestionCount * 45)) : 70;
      }
      return 480; // Results with answer
    }

    if (isSearching) return 240; // Searching state

    // IDLE state with search focused
    if (isSearchFocused) {
      return showAutocomplete ? (70 + (suggestionCount * 45)) : 70;
    }

    return 340; // Idle state
  };

  return (
    <motion.div
        ref={containerRef}
        className={isExpanded ? "cw2-ask-ai-container" : "cw2-collapsed-button"}
        onClick={!isExpanded ? handleCollapsedClick : undefined}
        layout
        initial={false}
        animate={{
          width: isExpanded ? 392 : 140,
          height: getContainerHeight(),
          borderRadius: isExpanded ? 24 : 40,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.8
        }}
      >
      {!isExpanded ? (
        // Collapsed content
        <motion.div
          className="cw2-collapsed-content"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={AISearchIcon} alt="AI Search" className="cw2-ai-search-icon" />
          <span className="cw2-collapsed-text">Ask AI</span>
        </motion.div>
      ) : (
        // Expanded content
        <>
          {/* Header */}
          <AnimatePresence>
            {!isSearchFocused && isIdle && (
              <motion.div
                className="cw2-ask-ai-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  delay: isSearchFocused ? 0 : 0.4,
                  duration: isSearchFocused ? 0.05 : 0.4
                }}
              >
                <h1 className="cw2-ask-ai-title">Ask AI</h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Searching Status */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                className="cw2-searching-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-white text-lg font-medium mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: searchStatusVisible ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  Searching {SEARCHING_CONTENT[currentSearchIndex]}...
                </motion.div>
                <motion.div
                  className="text-white/60 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: searchStatusVisible ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  Finding the best information for you
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search History Navigation Bar */}
          <AnimatePresence>
            {isResults && conversationHistory.length > 0 && conversationHistory.length < 5 && !isSearchFocused && (
              <motion.div
                className="cw2-search-history-navigation"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="cw2-search-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cw2-search-nav-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <div className="cw2-progress-bar-container">
                  <div className="cw2-progress-track">
                    {conversationHistory.map((msg, index) => {
                      const totalSegments = conversationHistory.length;
                      const gapWidth = 6;
                      const totalGapWidth = (totalSegments - 1) * gapWidth;
                      const availableWidth = 100 - totalGapWidth;
                      const segmentWidth = availableWidth / totalSegments;
                      const segmentLeft = index * (segmentWidth + gapWidth);
                      const starLeft = segmentLeft + segmentWidth + (gapWidth / 2) - 1;
                      const showStar = conversationHistory.length >= 3 && index < conversationHistory.length - 1 && starLeft < 88;

                      return (
                        <div key={index}>
                          <div
                            className={`cw2-progress-segment ${index === activeTabId ? 'active' : ''}`}
                            style={{
                              width: `${segmentWidth}%`,
                              left: `${segmentLeft}%`
                            }}
                            onClick={() => {
                              setResults(msg);
                              setActiveTabId(index);
                            }}
                          />
                          {showStar && (
                            <img
                              src={StarsIcon}
                              alt="Stars"
                              className="cw2-progress-segment-stars"
                              style={{
                                position: 'absolute',
                                left: `${starLeft}%`,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '10px',
                                height: '10px',
                                pointerEvents: 'none',
                                zIndex: 10
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Title */}
          <AnimatePresence>
            {isResults && results && !isSearchFocused && (
              <motion.div
                className="cw2-ask-ai-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <h1 className="cw2-ask-ai-title">{results.query}</h1>
                {conversationHistory.length >= 5 && (
                  <button
                    className="cw2-clock-button cw2-title-clock"
                    onClick={() => setShowPromptHistory(!showPromptHistory)}
                  >
                    <img src={ClockIcon} alt="History" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Display - MOVED BEFORE Search Bar */}
          <AnimatePresence>
            {isResults && results && !isSearchFocused && (
              <motion.div
                className="cw2-results-container"
                style={{
                  padding: '16px',
                  marginTop: '8px',
                  marginBottom: '16px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Answer */}
                <p className="cw2-answer-text">
                  {results.answer}
                </p>

                {/* Sources */}
                {results.sources && results.sources.length > 0 && (
                  <div className="mb-4">
                    <ImprovedStackedSources
                      sources={results.sources}
                      onSourceClick={(source) => {
                        console.log('Source clicked:', source);
                      }}
                    />
                  </div>
                )}

                {/* Suggestions */}
                {results.suggestions && results.suggestions.length > 0 && (
                  <div className="cw2-trending-searches">
                    {results.suggestions.map((suggestion, index) => {
                      const mockCounts = ['12.5k', '8.3k', '5.1k'];
                      return (
                        <TrendingSearchItem
                          key={index}
                          text={suggestion}
                          count={mockCounts[index] || '1.2k'}
                          onClick={() => handleSearchSubmit(suggestion)}
                          index={index}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearchBar && !isSearching && (
              <motion.div
                className={isSearchFocused ? "cw2-search-bar-bottom" : "cw2-search-bar-top"}
                initial={{ opacity: 0, y: isSearchFocused ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: isSearchFocused ? 10 : -10,
                  transition: { duration: isSearchFocused ? 0.1 : 0.4 }
                }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {/* Autocomplete Dropdown */}
                <AutocompleteDropdown
                  searchValue={searchValue}
                  onSuggestionSelect={handleAutocompleteSelect}
                  isVisible={showAutocomplete && isExpanded}
                  onSuggestionCountChange={handleSuggestionCountChange}
                />

                <SearchBar
                  placeholder={isResults ? "Ask a follow-up question..." : "Ask anything"}
                  onSubmit={handleSearchSubmit}
                  onVoiceRecord={handleVoiceRecord}
                  onFocus={handleSearchFocus}
                  onInputChange={handleInputChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trending Searches */}
          <AnimatePresence mode="wait">
            {showTrendingSearches && !isSearchFocused && isIdle && (
              <motion.div
                key={animationKey}
                className="cw2-trending-searches"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.2,
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                  }
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: isSearchFocused ? 0.05 : 0.2,
                    ease: "easeOut"
                  }
                }}
              >
                {TRENDING_SEARCHES.map((search, index) => (
                  <motion.div
                    key={`${animationKey}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }}
                  >
                    <TrendingSearchItem
                      text={search.text}
                      count={formatCounter(counters[index])}
                      onClick={handleTrendingClick}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Button */}
          <AnimatePresence>
            {showExpandButton && !isSearchFocused && isIdle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: isSearchFocused ? 0.05 : 0.4,
                  ease: "easeOut"
                }}
              >
                <ExpandButton
                  text="Other Trending Searches"
                  isExpanded={false}
                  onClick={handleExpandClick}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt History Glass Overlay */}
          <AnimatePresence>
            {showPromptHistory && conversationHistory.length > 0 && (
              <motion.div
                className="cw2-prompt-history-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowPromptHistory(false)}
              >
                <motion.div
                  className="cw2-prompt-history-panel"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="cw2-history-header">
                    <h3 className="cw2-history-title">Recent Searches</h3>
                  </div>
                  <div className="cw2-history-list">
                    {conversationHistory.map((msg, index) => (
                      <button
                        key={index}
                        className="cw2-history-item"
                        onClick={() => {
                          setResults(msg);
                          setActiveTabId(index);
                          setShowPromptHistory(false);
                        }}
                      >
                        <span className="cw2-history-item-text">{msg.query}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};
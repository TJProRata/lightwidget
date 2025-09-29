import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { CONTENT_STATES } from '../../../lib/constants';
import { SUGGESTIONS, MORE_SUGGESTIONS, AUTOCOMPLETE_DATA, SEARCHING_CONTENT } from '../../../lib/mockData';
import { SearchBar } from '../molecules/SearchBar';
import { SuggestionChip } from '../molecules/SuggestionChip';
import { AutocompleteDropdown } from '../molecules/AutocompleteDropdown';
import { ImprovedStackedSources } from '../molecules/ImprovedStackedSources';
import { MoreButton } from '../molecules/Buttons';
import { PoweredByLogo } from '../atoms/PoweredByLogo';
import { Text } from '../atoms/Typography';
import { MessageSquare, Plus, ArrowUpRight } from 'lucide-react';
import { NYTLogo, PlusIcon } from '../atoms/Icons';
import StarsIcon from '../../../assets/stars.svg';
import ClockIcon from '../../../assets/clock.svg';
import awLogo from '../../../assets/awlogo.png';
import dmLogo from '../../../assets/dmlogo.png';
import nytLogo from '../../../assets/nytlogo.png';
import moreLogo from '../../../assets/morelogo.png';

export const MainFlowAnimated = ({ initialExpanded = false }) => {
  // Generate session ID
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`).current;

  // Core state - simplified like ChatWidget2
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [contentState, setContentState] = useState(CONTENT_STATES.IDLE);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [suggestionCount, setSuggestionCount] = useState(0);

  // Animation state
  const [animationKey, setAnimationKey] = useState(0);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchStatusVisible, setSearchStatusVisible] = useState(true);

  // Conversation state
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);
  const [showPromptHistory, setShowPromptHistory] = useState(false);

  // Convex hooks
  const messages = useQuery(api.messages.getMessages, { userId: sessionId }) || [];
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteBranch = useMutation(api.messages.deleteBranch);
  const clearAllMessages = useMutation(api.messages.clearAllMessages);
  const chatTabs = useQuery(api.chat.getChatTabs) || [];
  const createChatTab = useMutation(api.chat.createChatTab);
  const updateChatTab = useMutation(api.chat.updateChatTab);
  const deleteChatTab = useMutation(api.chat.deleteChatTab);
  const clearAllChatTabs = useMutation(api.chat.clearAllChatTabs);
  const promptHistory = useQuery(api.chat.getPromptHistory) || [];
  const addToPromptHistory = useMutation(api.chat.addToPromptHistory);
  const clearAllPromptHistory = useMutation(api.chat.clearAllPromptHistory);
  const suggestions = useQuery(api.suggestions.getSuggestions) || [];
  const autocompleteData = useQuery(api.suggestions.getAutocompleteData) || [];

  const containerRef = useRef(null);

  // Computed state helpers (like UnifiedChatPhase)
  const isIdle = contentState === CONTENT_STATES.IDLE;
  const isSearching = contentState === CONTENT_STATES.SEARCHING;
  const isResults = contentState === CONTENT_STATES.RESULTS;

  // Determine title based on state (like UnifiedChatPhase)
  const getTitle = () => {
    if (isSearching) return "Top Stories";
    if (isResults && results?.query) return results.query;
    return "Ask TechNews anything";
  };

  // Clear data on mount
  useEffect(() => {
    Promise.all([
      clearAllMessages(),
      clearAllChatTabs(),
      clearAllPromptHistory()
    ]).catch(error => {
      console.error("Failed to clear data on page load:", error);
    });
  }, []);

  // Animation sequence when expanding (like ChatWidget2)
  useEffect(() => {
    if (!isExpanded) {
      // Reset all states when collapsing
      setContentState(CONTENT_STATES.IDLE);
      setSearchValue('');
      setShowAutocomplete(false);
      setIsSearchFocused(false);
      return;
    }

    // Set initial state when expanding
    if (isExpanded && contentState === CONTENT_STATES.IDLE) {
      // Delay to show animation
      const timer = setTimeout(() => {
        setShowMoreButton(true);
      }, 600);

      return () => clearTimeout(timer);
    }

  }, [isExpanded, contentState]);

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

  // Click outside to collapse
  useClickOutside(containerRef, () => {
    if (isExpanded) {
      if (isSearchFocused) {
        // Smoothly unfocus and show suggestions again
        setIsSearchFocused(false);
        setShowAutocomplete(false);
        setTimeout(() => {
          setShowSuggestions(true);
          setShowMoreButton(true);
        }, 200);
      } else {
        setIsExpanded(false);
      }
    }
  }, isExpanded);

  // Calculate dynamic container dimensions
  const getContainerDimensions = () => {
    if (!isExpanded) {
      return { width: 103, height: 51 };
    }

    if (isResults) {
      return { width: 400, height: 480 };
    }

    if (isSearching) {
      return { width: 400, height: 240 };
    }

    // When search is focused - smoother transition
    if (isSearchFocused) {
      const baseHeight = 90; // Slightly smaller for cleaner look
      const autocompleteHeight = showAutocomplete ? (suggestionCount * 46) : 0;
      const totalHeight = baseHeight + autocompleteHeight;
      // Add some padding for better visual balance
      return { width: 400, height: Math.max(totalHeight, 90) };
    }

    return { width: 400, height: 340 };
  };

  const { width, height } = getContainerDimensions();

  // Event handlers
  const handleExpandClick = () => {
    setIsExpanded(true);
    setAnimationKey(prev => prev + 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowAutocomplete(value.trim().length > 0);
  };

  const handleAutocompleteSuggestionSelect = (suggestion) => {
    setSearchValue(suggestion);
    setShowAutocomplete(false);
    handleSearch(suggestion);
  };

  const handleSuggestionCountChange = (count) => {
    setSuggestionCount(count);
  };

  const handleSearchFocus = () => {
    // Immediately focus - let animations handle timing
    setIsSearchFocused(true);
    // Clear autocomplete when focusing in results phase
    if (isResults) {
      setShowAutocomplete(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      handleSearch(searchValue.trim());
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSearchValue(query);
    setContentState(CONTENT_STATES.SEARCHING);
    setIsSearchFocused(false);

    // Add to prompt history
    await addToPromptHistory({
      title: query.length > 50 ? query.substring(0, 50) + '...' : query,
      query: query
    });

    // Simulate API call
    setTimeout(async () => {
      const answer = `Here's information about: ${query}\n\nThis is a simulated response that would normally come from an AI service.`;

      // Save message to Convex with simple data
      const messageId = await sendMessage({
        query: query,
        answer: answer,
        sources: [
          { name: 'Wikipedia', percentage: 45 },  // Number for Convex validation
          { name: 'Reuters', percentage: 30 },
          { name: 'CNN', percentage: 15 },
          { name: 'NYTimes', percentage: 10 }
        ],
        suggestions: ['Tell me more', 'Implications?', 'Compare to previous?'],
        userId: sessionId,
        parentMessageId: currentMessageId || undefined,
        sequenceNumber: conversationHistory.length,
        conversationPath: conversationHistory.length.toString()
      });

      setCurrentMessageId(messageId);

      // Create enhanced version for local display with logos and colors
      const newMessage = {
        _id: messageId,
        query: query,
        answer: answer,
        sources: [
          {
            id: 'source-1',
            name: 'Wikipedia',
            logo: awLogo,
            percentage: '45%',  // String with % for display
            color: 'rgba(187, 97, 239, 0.78)'
          },
          {
            id: 'source-2',
            name: 'Reuters',
            logo: dmLogo,
            percentage: '30%',
            color: 'rgba(111, 97, 239, 0.78)'
          },
          {
            id: 'source-3',
            name: 'CNN',
            logo: moreLogo,
            percentage: '15%',
            color: 'rgba(144, 132, 250, 0.78)'
          },
          {
            id: 'source-4',
            name: 'NYTimes',
            logo: nytLogo,
            percentage: '10%',
            color: 'rgba(93, 93, 93, 0.78)'
          }
        ],
        suggestions: ['Tell me more', 'Implications?', 'Compare to previous?']
      };

      setConversationHistory(prev => [...prev, newMessage]);
      setActiveTabId(conversationHistory.length);

      setResults(newMessage);
      setContentState(CONTENT_STATES.RESULTS);
      setSearchValue('');  // Clear the search input
      setShowAutocomplete(false);  // Also clear autocomplete
    }, 3000);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  const handleMoreClick = () => {
    setShowMoreSuggestions(!showMoreSuggestions);
  };

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    collapsed: {
      width: 103,
      height: 51,
      borderRadius: 26
    },
    expanded: {
      width,
      height,
      borderRadius: 24
    }
  }), [width, height]);

  const currentSuggestions = (() => {
    if (isResults && results?.suggestions) {
      return results.suggestions;
    }
    return suggestions.length > 0
      ? suggestions.map(s => s.text)
      : (showMoreSuggestions ? MORE_SUGGESTIONS : SUGGESTIONS);
  })();

  const currentAutocompleteData = autocompleteData.length > 0
    ? autocompleteData.map(a => a.text)
    : AUTOCOMPLETE_DATA;

  return (
    <motion.div
      ref={containerRef}
      className="chat-widget-unified-container"
      layout
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.8
      }}
      style={{
        position: 'relative',
        background: 'rgba(20, 20, 20, 0.75)',
        backdropFilter: 'blur(15.8px)',
        WebkitBackdropFilter: 'blur(15.8px)',
        border: '1px solid rgba(30, 30, 30, 0.32)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: !isExpanded ? 'pointer' : 'default',
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'transform, width, height'
      }}
      onClick={!isExpanded ? handleExpandClick : undefined}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - compact button content
          <motion.div
            key="collapsed"
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-1.5">
              <img src={StarsIcon} alt="Stars" className="w-4 h-4" />
              <Text variant="button" className="text-white text-sm font-medium">Ask</Text>
              <NYTLogo className="w-6 h-6" />
            </div>
          </motion.div>
        ) : (
          // Expanded state - full chat interface
          <motion.div
            key="expanded"
            className="flex flex-col h-full p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.3 }}
            style={{
              minHeight: isSearchFocused ? '100px' : isSearching ? '240px' : 'auto',
              justifyContent: isSearching ? 'center' : 'flex-start'
            }}
          >
            {/* Search History Navigation Bar - at the top */}
            <AnimatePresence>
              {isResults && conversationHistory.length > 0 && (
                <motion.div
                  className="search-history-navigation"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="search-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-nav-icon">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-track">
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
                              className={`progress-segment ${index === activeTabId ? 'active' : ''}`}
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
                                className="progress-segment-stars"
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

            {/* Dynamic Title with Clock Button */}
            <AnimatePresence mode="wait">
              {(isSearching || isResults) && (
                <motion.div
                  className={`title-wrapper ${isSearching ? 'searching' : ''} ${isResults ? 'results' : ''} mb-4`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Text variant="heading" className="text-white text-left">
                    {getTitle()}
                  </Text>
                  {isResults && conversationHistory.length >= 4 && (
                    <button
                      className={`clock-button title-clock`}
                      onClick={() => setShowPromptHistory(true)}
                    >
                      <img src={ClockIcon} alt="History" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle Title */}
            <AnimatePresence mode="wait">
              {isIdle && !isSearchFocused && (
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5, transition: { duration: 0.05 } }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-white text-xl font-semibold">Ask TechNews anything</h2>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Searching Status */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  className="pt-14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <motion.div
                      className="text-white text-lg font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: searchStatusVisible ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    >
                      {SEARCHING_CONTENT[currentSearchIndex].text}
                    </motion.div>
                    <motion.div
                      className="text-white/60 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: searchStatusVisible ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    >
                      {SEARCHING_CONTENT[currentSearchIndex].sources}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {isResults && results && (
                <motion.div
                  className="mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <p className="text-white/90 text-sm mb-2">{results.answer}</p>
                  {results.sources && (
                    <ImprovedStackedSources sources={results.sources} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt History Modal */}
            <AnimatePresence>
              {showPromptHistory && conversationHistory.length > 0 && (
                <motion.div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowPromptHistory(false)}
                >
                  <motion.div
                    className="bg-gray-900/95 rounded-xl p-4 max-w-sm w-full max-h-[400px] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Recent Searches</h3>
                      <button
                        onClick={() => setShowPromptHistory(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {conversationHistory.map((msg, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setResults(msg);
                            setActiveTabId(index);
                            setShowPromptHistory(false);
                          }}
                          className="w-full flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-left"
                        >
                          <MessageSquare className="w-4 h-4 text-white/60 flex-shrink-0" />
                          <span className="text-sm text-white/80 truncate">{msg.query}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Bar - Always show but different states */}
            <AnimatePresence>
              {(
                <motion.div
                  className={`cw1-search-bar-wrapper ${isSearchFocused ? 'cw1-search-bar-bottom' : 'cw1-search-bar-top'}`}
                  initial={{ opacity: 0, y: isSearchFocused ? 10 : -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: isSearchFocused ? 0.3 : 0.4,
                      delay: isSearchFocused ? 0 : 0.6
                    }
                  }}
                  exit={{
                    opacity: 0,
                    y: isSearchFocused ? 10 : -10,
                    transition: { duration: isSearchFocused ? 0.1 : 0.4 }
                  }}
                >
                  {/* Autocomplete Dropdown - positioned above search bar when at bottom */}
                  <AutocompleteDropdown
                    searchValue={searchValue}
                    onSuggestionSelect={handleAutocompleteSuggestionSelect}
                    isVisible={showAutocomplete && isExpanded && isSearchFocused}
                    onSuggestionCountChange={handleSuggestionCountChange}
                  />

                  <SearchBar
                    value={isSearching ? searchQuery : searchValue}
                    onChange={isSearching ? undefined : handleSearchChange}
                    onFocus={isSearching ? undefined : handleSearchFocus}
                    onKeyDown={isSearching ? undefined : handleSearchKeyDown}
                    readOnly={isSearching}
                    placeholder={isResults ? "Ask a follow-up question..." : "Ask me anything..."}
                    className={`unified-search-bar ${isSearching ? 'searching' : ''}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions */}
            <AnimatePresence mode="wait">
              {!isSearchFocused && (isIdle || isResults) && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.2,
                      staggerChildren: 0.1,
                      delayChildren: 0.1
                    }
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                >
                  {currentSuggestions.slice(0, showMoreSuggestions ? undefined : 3).map((suggestion, index) => (
                    <motion.div
                      key={`${animationKey}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SuggestionChip
                        text={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* More Button */}
            <AnimatePresence mode="wait">
              {isIdle && !isSearchFocused && (
                <motion.div
                  className="mt-3 flex justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <MoreButton onClick={handleMoreClick} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Powered By */}
            <AnimatePresence mode="wait">
              {isIdle && !isSearchFocused && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <PoweredByLogo />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
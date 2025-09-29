import { useEffect } from 'react';

export const useClickOutside = (ref, handler, isEnabled = true) => {
  useEffect(() => {
    if (!isEnabled) return;

    const listener = (event) => {
      // Do nothing if clicking ref's element or descendant elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, isEnabled]);
};
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'dark', // standard default resolved scheme on boot
  setTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const persisted = localStorage.getItem('theme');
      if (persisted && ['light', 'dark', 'system'].includes(persisted)) {
        return persisted;
      }
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  // Memoize setTheme setter function to prevent redundant re-renders
  const setTheme = useCallback((newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setThemeState(newTheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncThemeClasses = () => {
      // 1. Resolve active mode value
      let activeMode = theme;
      if (theme === 'system') {
        activeMode = mediaQuery.matches ? 'dark' : 'light';
      }

      setResolvedTheme(activeMode);

      // 2. Synchronize DOM classes
      if (activeMode === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    // Trigger on mount / updates
    syncThemeClasses();

    // 3. Listen to media queries preferences changes
    const listener = (e) => {
      if (theme === 'system') {
        syncThemeClasses();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener); // legacy fallback
    }

    // 4. Proper cleanup on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [theme]);

  // Context value optimization
  const contextValue = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme
  }), [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

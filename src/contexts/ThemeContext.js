import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import themes from '../theme/theme';

// Create theme context
const ThemeContext = createContext({
  mode: 'light',
  toggleThemeMode: () => {},
  setMode: () => {}
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Get saved theme from local storage or use light as default
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Effect to save theme mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleThemeMode,
      setMode
    }),
    [mode]
  );

  // Get the current theme based on mode
  const theme = themes[mode];

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

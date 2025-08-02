import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggler = () => {
  const { mode, toggleThemeMode } = useTheme();
  
  return (
    <Box sx={{ mr: 1 }}>
      <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
        <IconButton
          color="inherit"
          onClick={toggleThemeMode}
          aria-label="Toggle light/dark theme"
        >
          {mode === 'dark' ? (
            <LightModeOutlinedIcon fontSize="small" />
          ) : (
            <DarkModeOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggler;

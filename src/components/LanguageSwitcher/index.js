import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';

// Flag icons (using spans for simple implementation)
const LanguageFlag = ({ code }) => {
  const flags = {
    en: '🇺🇸',
    es: '🇪🇸',
    hi: '🇮🇳'
  };
  
  return (
    <span role="img" aria-label={`${code} flag`} style={{ marginRight: '8px', fontSize: '16px' }}>
      {flags[code] || '🌐'}
    </span>
  );
};

const languageOptions = [
  {
    code: 'en',
    name: 'English'
  },
  {
    code: 'es',
    name: 'Español'
  },
  {
    code: 'hi',
    name: 'हिंदी'
  }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    handleClose();
  };
  
  // Find current language
  const currentLang = languageOptions.find(lang => lang.code === i18n.language) || languageOptions[0];
  
  return (
    <Box>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<LanguageIcon />}
        sx={{ minWidth: 120, justifyContent: 'space-between', textTransform: 'none' }}
      >
        {currentLang.name}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem 
            key={option.code}
            selected={option.code === i18n.language}
            onClick={() => handleLanguageChange(option.code)}
          >
            <ListItemIcon>
              <LanguageFlag code={option.code} />
            </ListItemIcon>
            <ListItemText>{option.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;

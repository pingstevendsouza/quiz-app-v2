import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const Breadcrumbs = ({ items, separator, showHome, maxItems }) => {
  const theme = useTheme();

  // Add home breadcrumb if showHome is true and items don't start with home
  const breadcrumbItems = showHome && items.length > 0 && items[0].label !== 'Home'
    ? [{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: 16 }} /> }, ...items]
    : items;

  const handleClick = (event, href) => {
    if (!href) {
      event.preventDefault();
      return;
    }
    
    // Handle navigation - you can customize this based on your routing solution
    if (href.startsWith('/')) {
      event.preventDefault();
      // Add your navigation logic here (e.g., using React Router)
      console.log('Navigate to:', href);
    }
  };

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      separator={separator || <NavigateNextIcon fontSize="small" />}
      maxItems={maxItems}
      sx={{
        '& .MuiBreadcrumbs-ol': {
          flexWrap: 'nowrap',
        },
        '& .MuiBreadcrumbs-li': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiBreadcrumbs-separator': {
          color: theme.palette.text.disabled,
          mx: 0.5,
        },
      }}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isClickable = item.href && !isLast;

        return (
          <Box
            key={`${item.label}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 0,
            }}
          >
            {item.icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isLast 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
            )}
            
            {isClickable ? (
              <Link
                component="button"
                variant="body2"
                onClick={(event) => handleClick(event, item.href)}
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                  },
                  '&:focus': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                    borderRadius: 1,
                  },
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: isLast 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  fontWeight: isLast ? 500 : 400,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        );
      })}
    </MuiBreadcrumbs>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      icon: PropTypes.element,
    })
  ).isRequired,
  separator: PropTypes.element,
  showHome: PropTypes.bool,
  maxItems: PropTypes.number,
};

Breadcrumbs.defaultProps = {
  separator: null,
  showHome: false,
  maxItems: 8,
};

export default Breadcrumbs;

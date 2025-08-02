import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import ThemeToggler from '../../ThemeToggler';
import LanguageSwitcher from '../../LanguageSwitcher';
import Breadcrumbs from '../Breadcrumbs';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Divider,
  Badge,
  InputBase,
  alpha,
  Button,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Settings,
  Logout,
  Notifications,
  Search as SearchIcon,
  ShoppingCart,
  Edit,
  AccountCircle,
  Layers,
  KeyboardArrowDown,
  MenuOpen,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';

const TopAppBar = ({
  width,
  sidebarWidth,
  title,
  breadcrumbs,
  actions,
  onMenuToggle,
  onSidebarToggle,
  sidebarCollapsed,
  user,
  logout,
  isMobile,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    if (user) {
      logout();
    }
  };

  const getPageTitle = () => {
    if (title) return title;
    
    // Generate title based on breadcrumbs or fallback
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs[breadcrumbs.length - 1].label;
    }
    
    return 'ServiceNow Quiz App';
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { md: width },
        ml: { md: `${sidebarWidth}px` },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 1.5, sm: 2, md: 2.5 } }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ 
            mr: 1.5, 
            display: { md: 'none' },
            color: theme.palette.text.primary,
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Desktop Sidebar Toggle Button - Mantis Style */}
        <IconButton
          color="inherit"
          aria-label={sidebarCollapsed ? "expand sidebar" : "collapse sidebar"}
          onClick={onSidebarToggle}
          sx={{ 
            mr: 1.5, 
            display: { xs: 'none', md: 'flex' },
            color: theme.palette.text.primary,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 1.5,
            width: 34,
            height: 34,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        >
          {sidebarCollapsed ? <MenuOpen fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>

        {/* Title and Breadcrumbs */}
        <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Box>
              <Breadcrumbs items={breadcrumbs} />
              <Typography 
                variant="h6" 
                noWrap 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  mt: 0.5,
                }}
              >
                {getPageTitle()}
              </Typography>
            </Box>
          ) : (
            <Typography 
              variant="h6" 
              noWrap 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              {getPageTitle()}
            </Typography>
          )}
        </Box>

        {/* Mantis Dashboard Style Action Items */}
        <Stack direction="row" spacing={{ xs: 0.75, sm: 1.5 }} alignItems="center">
          {/* Search Bar - Mantis Style */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.black, 0.04),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.08),
              },
              width: { xs: '100%', sm: 224, md: 240 },
              ml: { xs: 0, md: 1 },
              mr: { xs: 0, md: 2 },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            </Box>
            <InputBase
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  fontSize: '0.875rem',
                  height: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Custom Actions */}
          {actions}

          {/* Theme Toggle Button */}
          <ThemeToggler />
          
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications - Mantis Style */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              sx={{ 
                color: theme.palette.text.secondary,
                width: 40,
                height: 40,
              }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Profile Menu Button - Mantis Style */}
          <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <Button
              variant="text"
              disableRipple
              onClick={handleProfileMenuOpen}
              endIcon={<KeyboardArrowDown sx={{ fontSize: '1rem' }} />}
              sx={{ 
                p: '6px 8px',
                minHeight: 0,
                minWidth: 0,
                textTransform: 'none',
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': { 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  '& .MuiAvatar-root': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                },
                '& .MuiButton-endIcon': { ml: 0.5 },
                borderRadius: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar 
                  src={user?.photoURL || user?.picture || user?.google?.picture}
                  alt={user?.name || user?.email || 'User'}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: (user?.photoURL || user?.picture || user?.google?.picture) 
                      ? 'transparent' 
                      : alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.text.primary,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {!(user?.photoURL || user?.picture || user?.google?.picture) && 
                    (user?.name ? user.name.charAt(0).toUpperCase() : <Person fontSize="small" />)
                  }
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.2 }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                    {user?.role || 'Admin'}
                  </Typography>
                </Box>
              </Stack>
            </Button>
          </Box>
        </Stack>

        {/* Profile Menu - Mantis Style */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 200,
              maxWidth: 240,
              borderRadius: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info in Menu - Mantis Style */}
          {user && (
            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={user?.photoURL || user?.picture || user?.google?.picture}
                  alt={user?.name || user?.email || 'User'}
                  sx={{ width: 40, height: 40 }}
                >
                  {!(user?.photoURL || user?.picture || user?.google?.picture) && 
                    (user?.name ? user.name.charAt(0).toUpperCase() : <Person />)
                  }
                </Avatar>
                <Stack spacing={0.3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.875rem' }} noWrap>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} noWrap>
                    {user?.role || 'Admin'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}
          
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Settings fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Edit fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Edit Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Layers fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Billing</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogout} sx={{ py: 1.25, px: 2.5, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Logout fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ color: 'error.main' }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

TopAppBar.propTypes = {
  width: PropTypes.string.isRequired,
  sidebarWidth: PropTypes.number.isRequired,
  title: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    icon: PropTypes.element,
  })),
  actions: PropTypes.node,
  onMenuToggle: PropTypes.func.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
  sidebarCollapsed: PropTypes.bool.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

TopAppBar.defaultProps = {
  title: null,
  breadcrumbs: [],
  actions: null,
  user: null,
};

export default TopAppBar;

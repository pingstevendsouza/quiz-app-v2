import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Person,
  Settings,
  Logout,
  Notifications,
  Edit,
  Visibility,
  Group,
  Payment,
  Refresh,
  KeyboardArrowRight,
  Dashboard,
  Quiz,
  Analytics,
  Help as HelpIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = ({ variant = 'header', showUserInfo = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuItemClick = (action) => {
    handleClose();
    
    switch (action) {
      case 'edit-profile':
      case 'view-profile':
        navigate('/profile');
        break;
      case 'social-profile':
        navigate('/profile?tab=2'); // Navigate to social tab
        break;
      case 'billing':
        // For now, navigate to profile - can be updated when billing page is created
        navigate('/profile');
        break;
      case 'account-settings':
      case 'privacy-settings':
      case 'notifications':
        navigate('/profile?tab=3'); // Navigate to settings tab
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'my-quizzes':
        navigate('/quizzes');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'help':
        navigate('/help');
        break;
      default:
        console.log('Menu action:', action);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user?.name || user?.username || user?.email || 'Quiz User';
  };

  const getUserRole = () => {
    return user?.role || 'Student';
  };

  // Mantis Dashboard Header Profile Style
  if (variant === 'header') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Mantis Dashboard Style Header Profile */}
        <Button
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            textTransform: 'none',
            color: 'text.primary',
            bgcolor: 'transparent',
            border: '1px solid transparent',
            '&:hover': {
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider'
            }
          }}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={user?.picture}
            alt={getUserDisplayName()}
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {!user?.picture && getInitials(getUserDisplayName())}
          </Avatar>
          {showUserInfo && (
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {getUserDisplayName()}
            </Typography>
          )}
        </Button>

      {/* Mantis Dashboard Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 320,
            maxWidth: 320,
            borderRadius: 2,
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar
              src={user?.picture}
              alt={getUserDisplayName()}
              sx={{ width: 48, height: 48 }}
            >
              {!user?.picture && getInitials(getUserDisplayName())}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {getUserDisplayName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getUserRole()}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => handleMenuItemClick('refresh')}
              sx={{ color: 'text.secondary' }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              },
              '& .MuiTabs-indicator': {
                height: 2,
              }
            }}
          >
            <Tab 
              icon={<Person sx={{ fontSize: 16 }} />} 
              iconPosition="start" 
              label="Profile" 
            />
            <Tab 
              icon={<Settings sx={{ fontSize: 16 }} />} 
              iconPosition="start" 
              label="Setting" 
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ py: 1 }}>
          {tabValue === 0 && (
            // Profile Tab Content
            <>
              <MenuItem 
                onClick={() => handleMenuItemClick('edit-profile')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Edit fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Edit Profile" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleMenuItemClick('view-profile')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Visibility fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="View Profile" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleMenuItemClick('social-profile')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Group fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Social Profile" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleMenuItemClick('billing')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Payment fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Billing" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
            </>
          )}
          
          {tabValue === 1 && (
            // Settings Tab Content
            <>
              <MenuItem 
                onClick={() => handleMenuItemClick('account-settings')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Settings fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Account Settings" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleMenuItemClick('privacy-settings')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Privacy Settings" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleMenuItemClick('notifications')}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Notifications fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Notification Settings" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </MenuItem>
            </>
          )}
        </Box>
        
        <Divider sx={{ mx: 2 }} />
        
        {/* Logout */}
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            px: 2, 
            py: 1.5, 
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '0.875rem', color: 'error.main' }}
          />
        </MenuItem>
      </Menu>
      </Box>
    );
  }

  // Mantis Dashboard Sidebar Profile Style
  if (variant === 'sidebar') {
    return (
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              p: 0,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={user?.picture}
                alt={getUserDisplayName()}
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: 'primary.main',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {!user?.picture && getInitials(getUserDisplayName())}
              </Avatar>
            </ListItemAvatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getUserDisplayName()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getUserRole()}
              </Typography>
            </Box>
            <ListItemSecondaryAction>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                  }
                }}
                aria-label="show more"
              >
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        {/* Profile Menu for Sidebar */}
        <Menu
          anchorEl={anchorEl}
          id="sidebar-profile-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 280,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info in Menu */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={user?.picture}
                alt={getUserDisplayName()}
                sx={{ width: 48, height: 48 }}
              >
                {!user?.picture && getInitials(getUserDisplayName())}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {getUserDisplayName()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getUserRole()}
                </Typography>
                {user?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
                {user?.google && (
                  <Chip
                    label="Google Account"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Dashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Quiz fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Quizzes</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Analytics fontSize="small" />
            </ListItemIcon>
            <ListItemText>Analytics</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Help & Support</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  // Default return for header variant
  return null;
};

export default Profile;

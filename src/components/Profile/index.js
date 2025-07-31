import React, { useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
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
    return user?.name || user?.username || user?.email || 'User';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* User Info */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {getUserDisplayName()}
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

      {/* Profile Avatar Button */}
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 1,
          border: '2px solid',
          borderColor: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
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
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          {!user?.picture && getInitials(getUserDisplayName())}
        </Avatar>
      </IconButton>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
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
              {user?.email && (
                <Typography variant="body2" color="text.secondary">
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
};

export default Profile;

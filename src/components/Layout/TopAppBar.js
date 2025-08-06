import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
  Apps as AppsIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile';

const TopAppBar = ({ 
  onMenuToggle,
  onCollapseToggle, 
  drawerWidth = 260,
  collapsed = false,
  title = "Quiz Dashboard"
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [appsAnchorEl, setAppsAnchorEl] = useState(null);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search:', searchValue);
  };

  const handleAppsClick = (event) => {
    setAppsAnchorEl(event.currentTarget);
  };

  const handleAppsClose = () => {
    setAppsAnchorEl(null);
  };

  const handleAppNavigation = (path) => {
    navigate(path);
    handleAppsClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${collapsed ? 65 : drawerWidth}px)` },
        ml: { sm: `${collapsed ? 65 : drawerWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        })
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 }
        }}
      >
        {/* Menu Toggle Button (Mobile) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' },
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Collapse Toggle Button (Desktop) */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onCollapseToggle}
          sx={{ 
            mr: 2, 
            display: { xs: 'none', sm: 'block' },
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main'
            }
          }}
        >
          <MenuIcon sx={{ 
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shortest,
            })
          }} />
        </IconButton>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.grey[500], 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.15),
            },
            '&:focus-within': {
              backgroundColor: alpha(theme.palette.grey[500], 0.15),
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            marginLeft: 0,
            width: '100%',
            maxWidth: 300,
            mr: 2
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
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search… (Ctrl + K)"
            value={searchValue}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                fontSize: '0.875rem'
              },
            }}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Header Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Applications Dropdown */}
          <Tooltip title="Applications">
            <IconButton
              size="medium"
              onClick={handleAppsClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              <AppsIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={appsAnchorEl}
            open={Boolean(appsAnchorEl)}
            onClose={handleAppsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 280,
                maxHeight: 400,
                mt: 1.5,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                }
              }
            }}
          >
            <Typography variant="h6" sx={{ px: 2, py: 1, fontSize: '1rem', fontWeight: 600 }}>
              Applications
            </Typography>
            <Divider />
            
            <MenuItem onClick={() => handleAppNavigation('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </MenuItem>
            
            <MenuItem onClick={() => handleAppNavigation('/start-quiz')}>
              <ListItemIcon>
                <AssessmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Start Quiz" />
            </MenuItem>
            
            <MenuItem onClick={() => handleAppNavigation('/ai-form-builder')}>
              <ListItemIcon>
                <BuildIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="AI Form Builder" />
            </MenuItem>
            
            <MenuItem onClick={() => handleAppNavigation('/quizzes')}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Quiz Management" />
            </MenuItem>
            
            <MenuItem onClick={() => handleAppNavigation('/users')}>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </MenuItem>
          </Menu>

          {/* Language Button */}
          <Tooltip title="Language">
            <IconButton
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              <Badge badgeContent={2} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Mail */}
          <Tooltip title="Messages">
            <IconButton
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              <MailIcon />
            </IconButton>
          </Tooltip>

          {/* Fullscreen Toggle */}
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              onClick={handleFullscreenToggle}
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Profile variant="header" showUserInfo={true} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Quiz as QuizIcon,
  CloudUpload,
  Assessment,
  Settings,
  Logout,
  Person,
  ChevronLeft,
  ChevronRight,
  Psychology,
  AccountCircle,
} from '@mui/icons-material';

// Configurable drawer width for expanded and collapsed states
const drawerWidth = 260;
const collapsedDrawerWidth = 70;

const DashboardLayout = ({ children, onMenuSelect, selectedItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  
  // Debug user object
  useEffect(() => {
    console.log('DashboardLayout - User object:', user);
  }, [user]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, value: 'Dashboard' },
    { text: 'Start Quiz', icon: <QuizIcon />, value: 'Create' },
    { text: 'Manage Exams', icon: <CloudUpload />, value: 'Update' },
    { text: 'Results', icon: <Assessment />, value: 'Results' },
    { text: 'Settings', icon: <Settings />, value: 'Settings' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          background: 'linear-gradient(180deg, #5e72e4 0%, #324cdd 100%)',
          color: 'white',
          minHeight: { xs: 64, sm: 70 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          flexGrow: 1,
          overflow: 'hidden',
        }}>
          <Psychology sx={{ fontSize: 32 }} />
          {!sidebarCollapsed && (
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              Brainy
            </Typography>
          )}
        </Box>
        <IconButton
          color="inherit"
          aria-label={sidebarCollapsed ? "expand drawer" : "collapse drawer"}
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: sidebarCollapsed ? 1 : 2, py: 3 }}>
        {menuItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.value}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Tooltip title={sidebarCollapsed ? item.text : ""} placement="right">
                <ListItemButton
                  selected={selectedItem === item.value}
                  onClick={() => {
                    onMenuSelect(item.value);
                    if (isMobile) {
                      setTimeout(() => setMobileOpen(false), 200);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    minHeight: 44,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(94, 114, 228, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(94, 114, 228, 0.12)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: sidebarCollapsed ? 0 : 40, 
                    color: theme.palette.text.secondary,
                    mr: sidebarCollapsed ? 0 : 2,
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Fade>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Pro Tip
          </Typography>
          <Typography variant="caption">
            Take practice quizzes regularly to improve your performance!
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { md: `${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          boxShadow: '0 2px 9px -3px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {selectedItem === 'Create' ? 'Start New Quiz' : 
             selectedItem === 'Update' ? 'Manage Exams' :
             selectedItem === 'Dashboard' ? 'Dashboard' :
             selectedItem === 'Results' ? 'Quiz Results' :
             selectedItem === 'Settings' ? 'Settings' : 'ServiceNow Quiz App'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {user?.name && (
              <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {user.name}
                </Typography>
              </Box>
            )}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ 
                  ml: 1, 
                  position: 'relative',
                  border: '2px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(94, 114, 228, 0.04)',
                  },
                  '&:focus': {
                    outline: 'none',
                  }
                }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  src={user?.photoURL || user?.picture || (user?.google?.picture)}
                  alt={user?.name || user?.email || 'User'}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: (user?.photoURL || user?.picture || user?.google?.picture) ? 'transparent' : 'white',
                    color: theme.palette.primary.main,
                    transform: 'translateX(0)', // Prevent shifting
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  {!(user?.photoURL || user?.picture || user?.google?.picture) && (user?.name ? user.name.charAt(0).toUpperCase() : <Person fontSize="small" />)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
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
            {user && (
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={user?.photoURL || user?.picture || (user?.google?.picture)}
                    alt={user?.name || user?.email || 'User'}
                    sx={{ width: 48, height: 48 }}
                  >
                    {!(user?.photoURL || user?.picture || user?.google?.picture) && (user?.name ? user.name.charAt(0).toUpperCase() : <Person />)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.name || 'User'}
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
            )}
            <MenuItem>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              if (user) {
                logout();
              }
            }} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { md: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s ease',
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              border: 'none',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          mt: { xs: 8, sm: 9 },
          transition: 'all 0.3s ease',
        }}
      >
        <Slide direction="up" in mountOnEnter unmountOnExit timeout={300}>
          <Box>{children}</Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 
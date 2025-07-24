import React, { useState } from 'react';
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
  Psychology,
} from '@mui/icons-material';

const drawerWidth = 260;

const DashboardLayout = ({ children, onMenuSelect, selectedItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Psychology sx={{ fontSize: 32 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Brainy
          </Typography>
        </Box>
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
      <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
        {menuItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.value}>
            <ListItem disablePadding sx={{ mb: 1 }}>
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
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          boxShadow: '0 2px 9px -3px rgba(0,0,0,0.05)',
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
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                <Person />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 9 },
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
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListSubheader,
  Badge,
  Paper,
  alpha,
  Stack,
} from '@mui/material';
import {
  Dashboard,
  Quiz as QuizIcon,
  CloudUpload,
  Assessment,
  Settings,
  Psychology,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Widgets,
  BarChart,
  DataObject,
  Chat,
  CalendarMonth,
  People,
  Person,
  ShoppingCart,
  ExpandMore,
  Logout,
  Edit,
  AccountCircle,
  Add,
  Layers,
  ViewQuilt,
  Animation,
  GridView,
  Palette,
  ExpandLess,
  ArrowRight,
  Notifications,
  Language,
  DarkMode,
  LightMode,
  Search,
  HelpOutline,
  SettingsOutlined,
  PersonOutline
} from '@mui/icons-material';

// Configurable drawer width for expanded and collapsed states - exact Mantis values
const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 65;

// Menu structure matching Mantis Dashboard exactly
const menuGroups = [
  {
    id: 'dashboard',
    items: [
      { id: 'dashboard', text: 'Dashboard', icon: <Dashboard fontSize="small" />, value: 'Dashboard', isExpandable: false },
    ]
  },
  {
    id: 'components',
    items: [
      { id: 'components', text: 'Components', icon: <Widgets fontSize="small" />, value: 'Components', isExpandable: false, badge: 'new' },
    ]
  },
  {
    id: 'widgets',
    label: 'Widgets',
    items: [
      { id: 'statistics', text: 'Statistics', icon: <BarChart fontSize="small" />, value: 'Statistics', isExpandable: false },
      { id: 'data', text: 'Data', icon: <DataObject fontSize="small" />, value: 'Data', isExpandable: false },
      { id: 'chart', text: 'Chart', icon: <Assessment fontSize="small" />, value: 'Chart', isExpandable: false },
    ]
  },
  {
    id: 'applications',
    label: 'Applications',
    items: [
      { id: 'chat', text: 'Chat', icon: <Chat fontSize="small" />, value: 'Chat', isExpandable: false },
      { id: 'calendar', text: 'Calendar', icon: <CalendarMonth fontSize="small" />, value: 'Calendar', isExpandable: false },
      { id: 'customer', text: 'Customer', icon: <People fontSize="small" />, value: 'Customer', isExpandable: false, hasChildren: true },
      { id: 'kanban', text: 'Kanban', icon: <ViewQuilt fontSize="small" />, value: 'Kanban', isExpandable: false },
    ]
  },
  {
    id: 'quiz',
    label: 'Quiz App',
    items: [
      { id: 'start-quiz', text: 'Start Quiz', icon: <QuizIcon fontSize="small" />, value: 'Create', isExpandable: false },
      { id: 'manage-exams', text: 'Manage Exams', icon: <CloudUpload fontSize="small" />, value: 'Update', isExpandable: false },
      { id: 'ai-form-builder', text: 'AI Form Builder', icon: <Psychology fontSize="small" />, value: 'ai-form-builder', isExpandable: false },
      { id: 'results', text: 'Results', icon: <Assessment fontSize="small" />, value: 'Results', isExpandable: false },
      { id: 'settings', text: 'Settings', icon: <Settings fontSize="small" />, value: 'Settings', isExpandable: false },
    ]
  },
  {
    id: 'custom-forms',
    label: 'Custom Forms',
    items: [
      ...customForms.map(form => ({
        id: form.id,
        text: form.name,
        icon: <DataObject fontSize="small" />,
        value: `custom-form-${form.id}`,
        isExpandable: false
      })),
      { id: 'ai-form-builder', text: 'Create New Form', icon: <Add fontSize="small" />, value: 'ai-form-builder', isExpandable: false }
    ]
  },
];

const Sidebar = ({
  width,
  collapsed,
  mobileOpen,
  isMobile,
  selectedItem,
  onMenuSelect,
  onDrawerToggle,
  onMobileClose,
  user,
  logout,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverGroup, setPopoverGroup] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const [customForms, setCustomForms] = useState([]);

  // Popover open/close handlers for submenu
  const handlePopoverOpen = (event, groupId) => {
    setAnchorEl(event.currentTarget);
    setPopoverGroup(groupId);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverGroup(null);
  };

  const handleMenuItemClick = (value) => {
    onMenuSelect(value);
    if (isMobile) {
      setTimeout(() => onMobileClose(), 200);
    }
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    if (logout) {
      logout();
    }
  };
  
  const handleGroupToggle = (groupId) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Load custom forms from localStorage
  useEffect(() => {
    const loadCustomForms = () => {
      const storedForms = JSON.parse(localStorage.getItem('customForms') || '[]');
      setCustomForms(storedForms);
    };

    loadCustomForms();

    // Listen for new form creation
    const handleFormCreated = (event) => {
      loadCustomForms();
    };

    window.addEventListener('formCreated', handleFormCreated);
    return () => window.removeEventListener('formCreated', handleFormCreated);
  }, []);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header - Mantis Logo */}
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 70 },
          px: collapsed ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: collapsed ? 0 : 1.5, 
          flexGrow: 1,
          overflow: 'hidden',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="Quiz App Logo"
            sx={{ 
              height: 28,
              width: collapsed ? 28 : 28,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
            }}
          />
          {!collapsed && (
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: theme.palette.text.primary,
              }}
            >
              Quiz App
            </Typography>
          )}
        </Box>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="end"
            onClick={onDrawerToggle}
            sx={{ ml: 1 }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      
      {/* User Profile Section - Only visible when expanded */}
 
      
      <Divider />
      
      {/* Navigation Menu - Mantis Style */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        overflowX: 'hidden',
        px: collapsed ? 1 : 2,
        py: 1.5,
      }}>
        {menuGroups.map((group) => (
          <React.Fragment key={group.id}>
            {group.label && !collapsed && (
              <ListSubheader
                disableSticky
                disableGutters
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  lineHeight: '1.5rem',
                  mt: 1,
                  mb: 0.5,
                  backgroundColor: 'transparent',
                }}
              >
                {group.label}
              </ListSubheader>
            )}
            
            <List
              disablePadding
              sx={{ 
                mb: group.label ? 1 : 0,
                '& .MuiListItem-root': {
                  mb: 0.5,
                }
              }}
            >
              {group.items.map((item) => (
                <Fade in timeout={200} key={item.id}>
                  <ListItem disablePadding>
                    <Tooltip 
                      title={collapsed ? item.text : ""} 
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        selected={selectedItem === item.value}
                        onClick={(e) => {
                          if (collapsed && item.hasChildren) {
                            handlePopoverOpen(e, item.id);
                          } else if (item.isExpandable) {
                            handleGroupToggle(item.id);
                          } else {
                            handleMenuItemClick(item.value);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (collapsed && item.hasChildren) {
                            handlePopoverOpen(e, item.id);
                          }
                        }}
                        onMouseLeave={() => {
                          if (collapsed && item.hasChildren) {
                            handlePopoverClose();
                          }
                        }}
                        sx={{
                          minHeight: 44,
                          px: collapsed ? 1.5 : 2.5,
                          borderRadius: 2,
                          mb: 0.5,
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          transition: 'background .2s',
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: collapsed ? 0 : 36,
                            mr: collapsed ? 0 : 2,
                            justifyContent: 'center',
                            color: selectedItem === item.value 
                              ? theme.palette.primary.main 
                              : theme.palette.text.secondary,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        
                        {!collapsed && (
                          <>
                            <ListItemText 
                              primary={item.text}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: selectedItem === item.value ? 600 : 400,
                                noWrap: true,
                              }}
                            />
                            
                            {item.badge && (
                              <Chip
                                label={item.badge}
                                color="primary"
                                size="small"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.625rem',
                                  fontWeight: 600,
                                  '& .MuiChip-label': { px: 0.75 }
                                }}
                              />
                            )}
                            
                            {item.hasChildren && (
                              <Box component="span" sx={{ ml: 0.5 }}>
                                <ArrowRight 
                                  fontSize="small" 
                                  sx={{ 
                                    fontSize: '1rem',
                                    color: theme.palette.text.secondary,
                                  }} 
                                />
                              </Box>
                            )}
                            
                            {item.isExpandable && (
                              <Box component="span" sx={{ ml: 0.5 }}>
                                {openGroups[item.id] ? 
                                  <ExpandLess fontSize="small" /> : 
                                  <ExpandMore fontSize="small" />
                                }
                              </Box>
                            )}
                          </>
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                </Fade>
              ))}
            </List>
          </React.Fragment>
        ))}
        
        {/* Settings and Utilities Section - Mantis Style */}
        {!collapsed && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <ListSubheader
              disableSticky
              disableGutters
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                lineHeight: '1.5rem',
                mb: 0.5,
                backgroundColor: 'transparent',
              }}
            >
              UTILITIES
            </ListSubheader>
            
            <List disablePadding sx={{ '& .MuiListItem-root': { mb: 0.5 } }}>
              {/* Search */}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    px: 2,
                    minHeight: 44,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mr: 2, color: theme.palette.text.secondary }}>
                    <Search fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Search"
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              {/* Settings */}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    px: 2,
                    minHeight: 44,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mr: 2, color: theme.palette.text.secondary }}>
                    <SettingsOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Settings"
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              {/* Help */}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    px: 2,
                    minHeight: 44,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mr: 2, color: theme.palette.text.secondary }}>
                    <HelpOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Help"
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
        
        {/* Utilities Icons for Collapsed Mode */}
        {collapsed && (
          <Box sx={{ mt: 2, mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tooltip title="Search" placement="right" arrow>
              <IconButton 
                sx={{ 
                  mb: 1, 
                  width: 40, 
                  height: 40, 
                  color: theme.palette.text.secondary,
                  '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.04) },
                }}
              >
                <Search fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings" placement="right" arrow>
              <IconButton 
                sx={{ 
                  mb: 1, 
                  width: 40, 
                  height: 40, 
                  color: theme.palette.text.secondary,
                  '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.04) },
                }}
              >
                <SettingsOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Help" placement="right" arrow>
              <IconButton 
                sx={{ 
                  mb: 1, 
                  width: 40, 
                  height: 40, 
                  color: theme.palette.text.secondary,
                  '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.04) },
                }}
              >
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      
      {/* Bottom User Profile Section - Visible in collapsed mode */}
      <Box sx={{ 
        mt: 'auto', 
        p: collapsed ? 1 : 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 1,
            p: collapsed ? 0.75 : 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.common.black, 0.04),
            },
          }}
        >
          <Avatar
            src={user?.photoURL || user?.picture || user?.google?.picture}
            alt={user?.name || user?.email || 'User'}
            sx={{ 
              width: collapsed ? 36 : 40, 
              height: collapsed ? 36 : 40,
              mr: collapsed ? 0 : 1.5,
            }}
          >
            {!(user?.photoURL || user?.picture || user?.google?.picture) && 
              (user?.name ? user.name.charAt(0).toUpperCase() : <Person />)
            }
          </Avatar>
          
          {!collapsed && (
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user?.name || 'JWT User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.role || 'UI/UX Designer'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
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
            minWidth: 220,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
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
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">View Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Layers fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Social Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.25, px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ShoppingCart fontSize="small" />
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
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: width }, 
        flexShrink: { md: 0 },
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        position: 'relative',
      }}
    >
      {/* Mantis Dashboard Style Toggle Button - Only visible on desktop */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            right: collapsed ? `calc(${COLLAPSED_DRAWER_WIDTH}px - 12px)` : `calc(${DRAWER_WIDTH}px - 12px)`,
            top: '95px',  // Position exactly like Mantis
            zIndex: 1299,  // Higher z-index to ensure visibility
            transition: theme.transitions.create(['right'], {
              easing: theme.transitions.easing.sharp, // Match Mantis easing
              duration: theme.transitions.duration.shorter, // Quicker transition for toggle button
            }),
          }}
        >
          <IconButton
            aria-label={collapsed ? "expand drawer" : "collapse drawer"}
            onClick={onDrawerToggle}
            size="small"
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '50%',
              width: '27px',  // Exact Mantis size
              height: '27px', // Exact Mantis size
              minWidth: '27px',
              minHeight: '27px',
              p: 0,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                color: theme.palette.primary.main,
                transform: 'translateX(0) scale(1.1)',
              },
              '&:active': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                transform: 'translateX(0) scale(0.98)',
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',  // Exact Mantis shadow
              transition: theme.transitions.create(
                ['background-color', 'color', 'transform', 'box-shadow'],
                { duration: theme.transitions.duration.shorter, easing: theme.transitions.easing.easeInOut }
              ),
              // Improve animation performance
              willChange: 'transform',
            }}
          >
            {/* Mantis-style hamburger with arrow */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {/* Hamburger icon */}
              <Box sx={{ width: 16, height: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: '2px' }}>
                <Box sx={{ height: 2, bgcolor: 'currentColor', mb: '2px', borderRadius: 1 }} />
                <Box sx={{ height: 2, bgcolor: 'currentColor', mb: '2px', borderRadius: 1 }} />
                <Box sx={{ height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
              </Box>
              {/* Animated arrow */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
                  transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <KeyboardArrowLeft sx={{ fontSize: '1.1rem' }} />
              </Box>
            </Box>
          </IconButton>
        </Box>
      )}
      
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
            border: 'none',
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3], // Mantis shadow style
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp, // Mantis uses sharp for drawer width changes
              duration: theme.transitions.duration.standard, // Standard duration for consistent timing
            }),
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              // Subtle hover effect like Mantis
              boxShadow: theme.shadows[8],
            },
            // Improve animation performance
            willChange: 'width',
            top: 0,
            height: '100%',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  width: PropTypes.number.isRequired,
  collapsed: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  selectedItem: PropTypes.string,
  onMenuSelect: PropTypes.func.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  onMobileClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func,
};

Sidebar.defaultProps = {
  selectedItem: 'Dashboard',
  user: null,
  logout: null,
};

export default Sidebar;

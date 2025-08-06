import React, { useState, useCallback } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
  Add as AddIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import Profile from '../Profile';

const Sidebar = ({ 
  open, 
  onClose, 
  drawerWidth = 260,
  collapsed = false,
  onToggleCollapse,
  selectedItem = 'dashboard',
  onItemSelect 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [expandedItems, setExpandedItems] = useState({
    dashboard: false,
    quizzes: false,
    analytics: false
  });

  // State for collapsed submenu popover
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const collapsedWidth = 65;
  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const handleExpandClick = (item) => {
    setExpandedItems(prev => {
      // Close all other expanded items and toggle the clicked one
      const newState = {
        dashboard: false,
        quizzes: false,
        analytics: false
      };
      newState[item] = !prev[item];
      return newState;
    });
  };

  const handleItemClick = (item, hasChildren = false) => {
    if (hasChildren) {
      if (collapsed) {
        // Don't expand/collapse in collapsed mode, let submenu handle it
        return;
      } else {
        // In expanded mode, toggle the submenu
        handleExpandClick(item);
      }
    } else {
      // Handle leaf item selection
      if (onItemSelect) {
        onItemSelect(item);
      }
      if (isMobile && onClose) {
        onClose();
      }
      // Close submenu if open
      setSubmenuAnchor(null);
      setActiveSubmenu(null);
    }
  };

  const handleMenuItemEnter = useCallback((event, item) => {
    if (collapsed && item.expandable) {
      // If switching to a different expandable item, force close then reopen
      if (activeSubmenu?.id !== item.id && activeSubmenu) {
        // Close current submenu first
        setSubmenuAnchor(null);
        setActiveSubmenu(null);
        // Use setTimeout to ensure the close happens before reopen
        setTimeout(() => {
          setSubmenuAnchor(event.currentTarget);
          setActiveSubmenu(item);
        }, 10);
      } else if (!activeSubmenu) {
        // Open submenu if none is currently open
        setSubmenuAnchor(event.currentTarget);
        setActiveSubmenu(item);
      }
    } else if (collapsed && !item.expandable) {
      // Close submenu when hovering over non-expandable items
      setSubmenuAnchor(null);
      setActiveSubmenu(null);
    }
  }, [collapsed, activeSubmenu]);

  const handleMenuItemLeave = useCallback(() => {
    // Do nothing - let the container handle closing
  }, []);

  const handleSubmenuClose = useCallback(() => {
    setSubmenuAnchor(null);
    setActiveSubmenu(null);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      expandable: true,
      children: [
        { id: 'dashboard-overview', title: 'Overview', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'dashboard-analytics', title: 'Analytics', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'dashboard-reports', title: 'Reports', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> }
      ]
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      icon: <QuizIcon />,
      expandable: true,
      children: [
        { id: 'quiz-start', title: 'Start Quiz', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'quiz-manage', title: 'Manage Quizzes', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'quiz-results', title: 'Results', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <AnalyticsIcon />,
      expandable: true,
      children: [
        { id: 'analytics-performance', title: 'Performance', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'analytics-charts', title: 'Charts', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> },
        { id: 'analytics-reports', title: 'Reports', icon: <ChevronRightIcon sx={{ fontSize: 16 }} /> }
      ]
    }
  ];

  const singleItems = [
    { id: 'learning', title: 'Learning Paths', icon: <SchoolIcon /> },
    { id: 'settings', title: 'Settings', icon: <SettingsIcon /> },
    { id: 'help', title: 'Help & Support', icon: <HelpIcon /> }
  ];

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      width: currentWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      })
    }}>
      {/* Logo/Brand Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <QuizIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            QuizMaster
          </Typography>
        )}
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List component="nav" sx={{ py: 0 }}>
          {/* Expandable Menu Items */}
          {menuItems.map((item) => (
            <Box key={item.id}>
              <ListItem 
                disablePadding 
                sx={{ 
                  display: 'block',
                  py: collapsed ? 0 : 0.5, // Remove padding when collapsed
                  px: collapsed ? 0 : 0 // Remove padding when collapsed
                }}
              >
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => handleItemClick(item.id, item.expandable)}
                  onMouseEnter={(e) => handleMenuItemEnter(e, item)}
                  onMouseLeave={handleMenuItemLeave}
                  sx={{
                    borderRadius: collapsed ? 0 : 1, // Remove border radius when collapsed to eliminate gaps
                    mx: collapsed ? 0 : 1, // Remove margin when collapsed
                    mb: collapsed ? 0 : 0.5, // Remove bottom margin when collapsed
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 2 : 2, // Consistent padding
                    py: collapsed ? 1.5 : 1, // More vertical padding when collapsed
                    minHeight: collapsed ? 48 : 40,
                    // Full width when collapsed
                    ...(collapsed && {
                      width: '100%',
                      borderRadius: 0
                    }),
                    '&.Mui-selected': {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 36,
                      justifyContent: 'center',
                      color: selectedItem === item.id ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedItem === item.id ? 600 : 500
                      }}
                    />
                  )}
                  {!collapsed && item.expandable && (
                    <IconButton
                      edge="end"
                      aria-label="expand"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpandClick(item.id);
                      }}
                      sx={{ 
                        p: 0.5,
                        ml: 'auto',
                        color: 'text.secondary'
                      }}
                    >
                      {expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Submenu Items - Show when expanded in normal mode */}
              {item.expandable && !collapsed && (
                <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.id} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          selected={selectedItem === child.id}
                          onClick={() => handleItemClick(child.id, false)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            px: 2,
                            pl: 4,
                            '&.Mui-selected': {
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.lighter',
                              },
                              '& .MuiListItemIcon-root': {
                                color: 'primary.main',
                              }
                            },
                            '&:hover': {
                              bgcolor: 'action.hover',
                            }
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 36,
                              justifyContent: 'center',
                              color: selectedItem === child.id ? 'primary.main' : 'text.secondary'
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.title}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              fontWeight: selectedItem === child.id ? 500 : 400
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Single Menu Items */}
          <Box>
            {singleItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => handleItemClick(item.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 36,
                      justifyContent: 'center',
                      color: selectedItem === item.id ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedItem === item.id ? 600 : 500
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </List>

        {/* Collapsed Submenu Popover */}
        <Menu
          anchorEl={submenuAnchor}
          open={Boolean(submenuAnchor) && collapsed}
          onClose={handleSubmenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          MenuListProps={{
            sx: { py: 0.5 },
            onMouseLeave: handleSubmenuClose
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 0,
              ml: 1,
              minWidth: 200,
              borderRadius: 2,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 20,
                left: -5,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          {activeSubmenu?.children?.map((child) => (
            <MenuItem
              key={child.id}
              selected={selectedItem === child.id}
              onClick={() => handleItemClick(child.id, false)}
              sx={{
                py: 1,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: selectedItem === child.id ? 'primary.main' : 'text.secondary'
                }}
              >
                {child.icon}
              </ListItemIcon>
              <ListItemText
                primary={child.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: selectedItem === child.id ? 500 : 400
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* Help Card */}
        {!collapsed && (
          <Box sx={{ mx: 2, mt: 2, mb: 1 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'primary.lighter',
                textAlign: 'center'
              }}
            >
              <HelpIcon sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                Need Help?
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Get support and resolve queries
              </Typography>
              <Chip
                label="Support"
                size="small"
                color="primary"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Profile Section at Bottom */}
      {!collapsed && <Profile variant="sidebar" />}
      {collapsed && (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Profile variant="header" showUserInfo={false} />
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: currentWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: currentWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            })
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

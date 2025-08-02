import React, { useState } from 'react';
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
  useMediaQuery
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
  PieChart as PieChartIcon
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
    dashboard: true,
    quizzes: false,
    analytics: false
  });

  const collapsedWidth = 65;
  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const handleExpandClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleItemClick = (item) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      expandable: true,
      children: [
        { id: 'dashboard-overview', title: 'Overview', icon: <CircleIcon sx={{ fontSize: 8 }} /> },
        { id: 'dashboard-analytics', title: 'Analytics', icon: <CircleIcon sx={{ fontSize: 8 }} /> },
        { id: 'dashboard-reports', title: 'Reports', icon: <CircleIcon sx={{ fontSize: 8 }} /> }
      ]
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      icon: <QuizIcon />,
      expandable: true,
      children: [
        { id: 'quiz-start', title: 'Start Quiz', icon: <AddIcon sx={{ fontSize: 16 }} /> },
        { id: 'quiz-manage', title: 'Manage Quizzes', icon: <ListIcon sx={{ fontSize: 16 }} /> },
        { id: 'quiz-results', title: 'Results', icon: <AssessmentIcon sx={{ fontSize: 16 }} /> }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <AnalyticsIcon />,
      expandable: true,
      children: [
        { id: 'analytics-performance', title: 'Performance', icon: <TrendingUpIcon sx={{ fontSize: 16 }} /> },
        { id: 'analytics-charts', title: 'Charts', icon: <BarChartIcon sx={{ fontSize: 16 }} /> },
        { id: 'analytics-reports', title: 'Reports', icon: <PieChartIcon sx={{ fontSize: 16 }} /> }
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
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.25rem',
              opacity: collapsed ? 0 : 1,
              transition: theme.transitions.create('opacity', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              })
            }}
          >
            Quiz App
          </Typography>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {/* Main Menu Items */}
        <List sx={{ px: 1 }}>
          {/* Dashboard Section */}
          <Box sx={{ mb: 2 }}>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Dashboard
              </Typography>
            )}
            
            {menuItems.map((item) => (
              <Box key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => item.expandable ? handleExpandClick(item.id) : handleItemClick(item.id)}
                    selected={selectedItem === item.id}
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
                      <>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: selectedItem === item.id ? 600 : 500
                          }}
                        />
                        {item.expandable && (
                          expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>

                {/* Expandable Children */}
                {item.expandable && !collapsed && (
                  <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children?.map((child) => (
                        <ListItem key={child.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleItemClick(child.id)}
                            selected={selectedItem === child.id}
                            sx={{
                              borderRadius: 1,
                              mx: 1,
                              mb: 0.5,
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
                                minWidth: 28,
                                color: selectedItem === child.id ? 'primary.main' : 'text.secondary'
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{
                                fontSize: '0.8rem',
                                fontWeight: selectedItem === child.id ? 600 : 400
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
          </Box>

          <Divider sx={{ mx: 2, my: 1 }} />

          {/* Other Menu Items */}
          <Box>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Tools
              </Typography>
            )}
            
            {singleItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item.id)}
                  selected={selectedItem === item.id}
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

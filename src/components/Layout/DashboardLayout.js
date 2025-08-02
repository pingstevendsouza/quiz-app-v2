import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useMaterialTheme } from '@mui/material/styles';
import { useTheme } from '../../contexts/ThemeContext';

import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';
import {
  Box,
  useMediaQuery,
  Slide,
  CssBaseline
} from '@mui/material';

// Mantis Dashboard exact drawer width
const DRAWER_WIDTH = 260;

const DashboardLayout = ({ 
  children, 
  onMenuSelect, 
  selectedItem,
  title = "Quiz Dashboard"
}) => {
  const materialTheme = useMaterialTheme();
  const { mode } = useTheme();
  const isMobile = useMediaQuery(materialTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  
  // Debug user object
  useEffect(() => {
    console.log('DashboardLayout - User object:', user);
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const getCurrentDrawerWidth = () => {
    return collapsed ? 65 : DRAWER_WIDTH;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Top App Bar - Mantis Dashboard Style */}
      <TopAppBar
        onMenuToggle={handleDrawerToggle}
        onCollapseToggle={handleCollapseToggle}
        drawerWidth={DRAWER_WIDTH}
        collapsed={collapsed}
        title={title}
      />

      {/* Sidebar Navigation - Mantis Dashboard Style */}
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerClose}
        drawerWidth={DRAWER_WIDTH}
        collapsed={collapsed}
        onToggleCollapse={handleCollapseToggle}
        selectedItem={selectedItem}
        onItemSelect={onMenuSelect}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${getCurrentDrawerWidth()}px)` },
          mt: { xs: 7, sm: 8 },
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          transition: materialTheme.transitions.create(['margin', 'width'], {
            easing: materialTheme.transitions.easing.sharp,
            duration: materialTheme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Slide direction="up" in mountOnEnter unmountOnExit timeout={300}>
          <Box sx={{ height: '100%' }}>
            {children}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onMenuSelect: PropTypes.func,
  selectedItem: PropTypes.string,
  title: PropTypes.string
};

DashboardLayout.defaultProps = {
  onMenuSelect: () => {},
  selectedItem: 'dashboard',
  title: 'Quiz Dashboard'
};

export default DashboardLayout;

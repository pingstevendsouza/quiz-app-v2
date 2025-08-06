import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Camera as CameraIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import PersonalTab from '../components/UserProfile/PersonalTab';
import ProfessionalTab from '../components/UserProfile/ProfessionalTab';
import SocialTab from '../components/UserProfile/SocialTab';
import SettingsTab from '../components/UserProfile/SettingsTab';
import { useUserProfile } from '../hooks/useUserProfile';

const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    profileData,
    loading,
    saving,
    updateProfile,
    uploadAvatar,
    resetChanges,
    hasUnsavedChanges
  } = useUserProfile();

  const tabs = [
    { label: 'Personal', component: PersonalTab },
    { label: 'Professional', component: ProfessionalTab },
    { label: 'Social', component: SocialTab },
    { label: 'Settings', component: SettingsTab }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Update URL parameter
    setSearchParams({ tab: newValue.toString() });
  };

  // Handle URL tab parameter on component mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam, 10);
      if (tabIndex >= 0 && tabIndex < tabs.length) {
        setActiveTab(tabIndex);
      }
    }
  }, [searchParams, tabs.length]);

  const handleSave = async () => {
    try {
      await updateProfile();
      setIsEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update profile. Please try again.');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        resetChanges();
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      await uploadAvatar(file);
      setSnackbarMessage('Profile picture updated successfully!');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update profile picture.');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const TabComponent = tabs[activeTab].component;

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={600} color="text.primary">
              User Profile
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving || !hasUnsavedChanges}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card - Left Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 24
              }}
            >
              {/* Avatar Section */}
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Box position="relative" mb={2}>
                  <Avatar
                    src={profileData?.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '2rem',
                      bgcolor: 'primary.main'
                    }}
                  >
                    {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 36,
                        height: 36,
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <CameraIcon fontSize="small" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleAvatarUpload(file);
                        }}
                      />
                    </IconButton>
                  )}
                </Box>
                
                <Typography variant="h6" fontWeight={600} textAlign="center">
                  {profileData?.firstName} {profileData?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {profileData?.role || 'User'}
                </Typography>
                <Chip
                  label={profileData?.status || 'Active'}
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Social Links */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Social Links
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {profileData?.socialLinks?.facebook && (
                    <IconButton
                      size="small"
                      href={profileData.socialLinks.facebook}
                      target="_blank"
                      sx={{ color: '#1877F2' }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {profileData?.socialLinks?.twitter && (
                    <IconButton
                      size="small"
                      href={profileData.socialLinks.twitter}
                      target="_blank"
                      sx={{ color: '#1DA1F2' }}
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {profileData?.socialLinks?.linkedin && (
                    <IconButton
                      size="small"
                      href={profileData.socialLinks.linkedin}
                      target="_blank"
                      sx={{ color: '#0A66C2' }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {profileData?.socialLinks?.instagram && (
                    <IconButton
                      size="small"
                      href={profileData.socialLinks.instagram}
                      target="_blank"
                      sx={{ color: '#E4405F' }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Stats */}
              {profileData?.stats && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(profileData.stats).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                          <Box textAlign="center">
                            <Typography variant="h6" fontWeight={600} color="primary.main">
                              {value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? 'scrollable' : 'standard'}
                  scrollButtons="auto"
                  sx={{
                    px: 3,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      minHeight: 64
                    }
                  }}
                >
                  {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                  ))}
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                <TabComponent
                  profileData={profileData}
                  isEditing={isEditing}
                  onUpdate={updateProfile}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saving}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default UserProfile;

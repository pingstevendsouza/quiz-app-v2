import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Avatar,
  Chip,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon,
  Language as WebsiteIcon,
  YouTube as YouTubeIcon,
  Pinterest as PinterestIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

const SocialTab = ({ profileData, isEditing, onUpdate }) => {
  const [localData, setLocalData] = React.useState(profileData || {});

  React.useEffect(() => {
    setLocalData(profileData || {});
  }, [profileData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData };
    
    if (field.includes('.')) {
      const keys = field.split('.');
      let current = updatedData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    } else {
      updatedData[field] = value;
    }
    
    setLocalData(updatedData);
    if (onUpdate) onUpdate(updatedData);
  };

  const socialPlatforms = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0A66C2',
      placeholder: 'https://linkedin.com/in/username'
    },
    {
      key: 'twitter',
      label: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1DA1F2',
      placeholder: 'https://twitter.com/username'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2',
      placeholder: 'https://facebook.com/username'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <InstagramIcon />,
      color: '#E4405F',
      placeholder: 'https://instagram.com/username'
    },
    {
      key: 'github',
      label: 'GitHub',
      icon: <GitHubIcon />,
      color: '#333',
      placeholder: 'https://github.com/username'
    },
    {
      key: 'website',
      label: 'Personal Website',
      icon: <WebsiteIcon />,
      color: '#666',
      placeholder: 'https://yourwebsite.com'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: <YouTubeIcon />,
      color: '#FF0000',
      placeholder: 'https://youtube.com/channel/username'
    },
    {
      key: 'pinterest',
      label: 'Pinterest',
      icon: <PinterestIcon />,
      color: '#BD081C',
      placeholder: 'https://pinterest.com/username'
    }
  ];

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getDisplayUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Social Media & Online Presence
      </Typography>

      <Grid container spacing={3}>
        {/* Social Links */}
        <Grid sx={{ width: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Social Media Profiles
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Connect your social media profiles to showcase your online presence.
          </Typography>
        </Grid>

        {socialPlatforms.map((platform) => (
          <Grid sx={{ width: { xs: '100%', sm: '50%' } }} key={platform.key}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: platform.color,
                      width: 40,
                      height: 40,
                      mr: 2
                    }}
                  >
                    {platform.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    {platform.label}
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label={`${platform.label} URL`}
                  placeholder={platform.placeholder}
                  value={localData.socialLinks?.[platform.key] || ''}
                  onChange={(e) => handleFieldChange(`socialLinks.${platform.key}`, e.target.value)}
                  disabled={!isEditing}
                  variant="outlined"
                  size="small"
                  error={
                    localData.socialLinks?.[platform.key] && 
                    !validateUrl(localData.socialLinks[platform.key])
                  }
                  helperText={
                    localData.socialLinks?.[platform.key] && 
                    !validateUrl(localData.socialLinks[platform.key])
                      ? 'Please enter a valid URL'
                      : ''
                  }
                  InputProps={{
                    endAdornment: localData.socialLinks?.[platform.key] && 
                      validateUrl(localData.socialLinks[platform.key]) ? (
                      <IconButton
                        size="small"
                        href={localData.socialLinks[platform.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    ) : null
                  }}
                />
                
                {localData.socialLinks?.[platform.key] && 
                 validateUrl(localData.socialLinks[platform.key]) && (
                  <Box mt={1}>
                    <Chip
                      label={getDisplayUrl(localData.socialLinks[platform.key])}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Privacy Settings */}
        <Grid sx={{ width: '100%' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Profile Visibility
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Control who can see your profile and social media links.
          </Typography>
        </Grid>

        <Grid sx={{ width: '100%', flexBasis: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Profile Visibility
              </Typography>
              
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localData.preferences?.privacy?.showEmail || false}
                      onChange={(e) => handleFieldChange('preferences.privacy.showEmail', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Show email address on profile"
                />
              </Box>
              
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localData.preferences?.privacy?.showPhone || false}
                      onChange={(e) => handleFieldChange('preferences.privacy.showPhone', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Show phone number on profile"
                />
              </Box>
              
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localData.preferences?.privacy?.allowMessages || true}
                      onChange={(e) => handleFieldChange('preferences.privacy.allowMessages', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Allow others to send me messages"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media Stats */}
        <Grid sx={{ width: '100%' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Social Media Insights
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Overview of your connected social media profiles.
          </Typography>
        </Grid>

        <Grid sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {socialPlatforms
              .filter(platform => localData.socialLinks?.[platform.key])
              .map((platform) => (
                <Grid sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }} key={platform.key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: platform.color,
                              width: 32,
                              height: 32,
                              mr: 1
                            }}
                          >
                            {platform.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {platform.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Connected
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            
            {socialPlatforms.filter(platform => localData.socialLinks?.[platform.key]).length === 0 && (
              <Grid sx={{ width: '100%' }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box textAlign="center" py={3}>
                      <Typography variant="body1" color="text.secondary">
                        No social media profiles connected yet.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Add your social media links above to see them here.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid sx={{ width: '100%' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Quick Actions
          </Typography>
        </Grid>

        <Grid sx={{ width: '100%' }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find LinkedIn Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find GitHub Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find Twitter Profile
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocialTab;

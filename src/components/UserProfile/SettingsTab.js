import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const SettingsTab = ({ profileData, isEditing, onUpdate }) => {
  const [localData, setLocalData] = React.useState(profileData || {});
  const [passwordDialog, setPasswordDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Here you would call the password change API
    console.log('Password change requested');
    setPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    // Here you would call the account deletion API
    console.log('Account deletion requested');
    setDeleteDialog(false);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Account Settings & Preferences
      </Typography>

      <Grid container spacing={3}>
        {/* Theme & Appearance */}
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PaletteIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Theme & Appearance
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={localData.preferences?.theme || 'system'}
                      onChange={(e) => handleFieldChange('preferences.theme', e.target.value)}
                      label="Theme"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={localData.preferences?.language || 'en'}
                      onChange={(e) => handleFieldChange('preferences.language', e.target.value)}
                      label="Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="it">Italian</MenuItem>
                      <MenuItem value="pt">Portuguese</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                      <MenuItem value="ja">Japanese</MenuItem>
                      <MenuItem value="ko">Korean</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid sx={{ width: '100%' }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={localData.preferences?.timezone || 'America/New_York'}
                      onChange={(e) => handleFieldChange('preferences.timezone', e.target.value)}
                      label="Timezone"
                    >
                      <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                      <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                      <MenuItem value="Europe/London">GMT</MenuItem>
                      <MenuItem value="Europe/Paris">Central European Time</MenuItem>
                      <MenuItem value="Asia/Tokyo">Japan Standard Time</MenuItem>
                      <MenuItem value="Asia/Shanghai">China Standard Time</MenuItem>
                      <MenuItem value="Australia/Sydney">Australian Eastern Time</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Preferences */}
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Notifications
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={3}>
                Choose how you want to receive notifications and updates.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localData.preferences?.notifications?.email || false}
                        onChange={(e) => handleFieldChange('preferences.notifications.email', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" ml={4}>
                    Receive important updates and notifications via email
                  </Typography>
                </Grid>
                
                <Grid sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localData.preferences?.notifications?.push || false}
                        onChange={(e) => handleFieldChange('preferences.notifications.push', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Push Notifications"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" ml={4}>
                    Receive real-time notifications in your browser
                  </Typography>
                </Grid>
                
                <Grid sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localData.preferences?.notifications?.sms || false}
                        onChange={(e) => handleFieldChange('preferences.notifications.sms', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" ml={4}>
                    Receive important alerts via text message
                  </Typography>
                </Grid>
                
                <Grid sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localData.preferences?.notifications?.marketing || false}
                        onChange={(e) => handleFieldChange('preferences.notifications.marketing', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Marketing Communications"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" ml={4}>
                    Receive promotional emails and product updates
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Security
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={3}>
                Control your privacy settings and account security.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Profile Visibility</InputLabel>
                    <Select
                      value={localData.preferences?.privacy?.profileVisibility || 'public'}
                      onChange={(e) => handleFieldChange('preferences.privacy.profileVisibility', e.target.value)}
                      label="Profile Visibility"
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                      <MenuItem value="contacts">Contacts Only</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Button 
                    fullWidth
                    variant="outlined" 
                    onClick={() => setPasswordDialog(true)}
                    disabled={!isEditing}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Management */}
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Account Management
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage your account settings and data.
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button variant="outlined">
                  Export Data
                </Button>
                <Button variant="outlined">
                  Download Profile
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                  disabled={!isEditing}
                >
                  Delete Account
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Account deletion is permanent and cannot be undone. All your data will be permanently removed.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity & Sessions */}
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Activity
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Last Login"
                    secondary="2 hours ago from 192.168.1.100"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Security" size="small" color="success" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Password Changed"
                    secondary="1 week ago"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Security" size="small" color="success" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email Verified"
                    secondary="2 weeks ago"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Verification" size="small" color="info" />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                error={passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''}
                helperText={
                  passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </Typography>
          </Alert>
          <Typography variant="body1" mb={2}>
            Please type <strong>DELETE</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="contained"
            color="error"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsTab;

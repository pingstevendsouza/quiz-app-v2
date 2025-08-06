import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Divider
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

const PersonalTab = ({ profileData, isEditing, onUpdate }) => {
  const [localData, setLocalData] = React.useState(profileData || {});
  const [showVerificationAlert, setShowVerificationAlert] = React.useState(false);

  React.useEffect(() => {
    setLocalData(profileData || {});
  }, [profileData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData };
    
    // Handle nested fields
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

  const handleLanguageAdd = (language) => {
    const currentLanguages = localData.personalInfo?.languages || [];
    if (!currentLanguages.includes(language) && language.trim()) {
      handleFieldChange('personalInfo.languages', [...currentLanguages, language]);
    }
  };

  const handleLanguageRemove = (languageToRemove) => {
    const currentLanguages = localData.personalInfo?.languages || [];
    handleFieldChange('personalInfo.languages', 
      currentLanguages.filter(lang => lang !== languageToRemove)
    );
  };

  const sendVerificationEmail = () => {
    setShowVerificationAlert(true);
    setTimeout(() => setShowVerificationAlert(false), 5000);
  };

  const availableLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Personal Information
        </Typography>

        {showVerificationAlert && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Verification email sent! Please check your inbox.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid sx={{ width: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Basic Information
            </Typography>
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="First Name"
              value={localData.firstName || ''}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="Last Name"
              value={localData.lastName || ''}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={localData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                endAdornment: localData.emailVerified ? (
                  <VerifiedIcon color="success" />
                ) : (
                  <IconButton
                    size="small"
                    onClick={sendVerificationEmail}
                    title="Send verification email"
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                )
              }}
              helperText={
                localData.emailVerified 
                  ? "Email verified" 
                  : "Click the send icon to verify your email"
              }
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={localData.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <DatePicker
              label="Date of Birth"
              value={localData.dateOfBirth ? parseISO(localData.dateOfBirth) : null}
              onChange={(date) => {
                if (date) {
                  handleFieldChange('dateOfBirth', format(date, 'yyyy-MM-dd'));
                }
              }}
              disabled={!isEditing}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={localData.personalInfo?.gender || ''}
                onChange={(e) => handleFieldChange('personalInfo.gender', e.target.value)}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Address Information */}
          <Grid sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Address Information
            </Typography>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Street Address"
              value={localData.address?.street || ''}
              onChange={(e) => handleFieldChange('address.street', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="City"
              value={localData.address?.city || ''}
              onChange={(e) => handleFieldChange('address.city', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="State/Province"
              value={localData.address?.state || ''}
              onChange={(e) => handleFieldChange('address.state', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              value={localData.address?.zipCode || ''}
              onChange={(e) => handleFieldChange('address.zipCode', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="Country"
              value={localData.address?.country || ''}
              onChange={(e) => handleFieldChange('address.country', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          {/* Additional Information */}
          <Grid sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Additional Information
            </Typography>
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <TextField
              fullWidth
              label="Nationality"
              value={localData.personalInfo?.nationality || ''}
              onChange={(e) => handleFieldChange('personalInfo.nationality', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={localData.personalInfo?.timezone || ''}
                onChange={(e) => handleFieldChange('personalInfo.timezone', e.target.value)}
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

          {/* Languages */}
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500} mb={1}>
              Languages
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {(localData.personalInfo?.languages || []).map((language) => (
                <Chip
                  key={language}
                  label={language}
                  onDelete={isEditing ? () => handleLanguageRemove(language) : undefined}
                  deleteIcon={<CloseIcon />}
                  variant="outlined"
                />
              ))}
            </Box>
            {isEditing && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Add Language</InputLabel>
                <Select
                  value=""
                  onChange={(e) => {
                    handleLanguageAdd(e.target.value);
                  }}
                  label="Add Language"
                >
                  {availableLanguages
                    .filter(lang => !(localData.personalInfo?.languages || []).includes(lang))
                    .map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {/* Bio Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              About Me
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={localData.bio || ''}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              helperText={`${(localData.bio || '').length}/500 characters`}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default PersonalTab;

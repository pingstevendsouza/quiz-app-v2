import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { PlayArrow as StartIcon } from '@mui/icons-material';

const StartQuizForm = ({ availableQuizzes, onStartQuiz, loading = false }) => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    selectedQuiz: null,
    shuffle: 'No',
    fromQuestion: '',
    toQuestion: '',
    hours: 1,
    minutes: 30,
    seconds: 0
  });
  
  const [errors, setErrors] = useState({});

  const examOptions = availableQuizzes || [
    { id: 1, title: 'CSA', description: 'ServiceNow Certified System Administrator' },
    { id: 2, title: 'CAD', description: 'ServiceNow Certified Application Developer' },
    { id: 3, title: 'CIS - ITSM', description: 'ServiceNow CIS - IT Service Management' },
    { id: 4, title: 'CIS - IRM', description: 'ServiceNow CIS - IT Risk Management' },
    { id: 5, title: 'CIS - VRM', description: 'ServiceNow CIS - Vendor Risk Management' },
    { id: 6, title: 'CIS - VR', description: 'ServiceNow CIS - Vulnerability Response' }
  ];

  const hourOptions = Array.from({ length: 100 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.selectedQuiz) {
      newErrors.selectedQuiz = 'Please select a quiz';
    }
    
    if (formData.fromQuestion && formData.toQuestion) {
      const from = parseInt(formData.fromQuestion);
      const to = parseInt(formData.toQuestion);
      
      if (to < from) {
        newErrors.toQuestion = 'To question must be greater than from question';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const totalTimeInSeconds = (formData.hours * 3600) + (formData.minutes * 60) + formData.seconds;
    
    const quizConfig = {
      selectedQuiz: formData.selectedQuiz,
      shuffle: formData.shuffle === 'Yes',
      fromQuestion: formData.fromQuestion ? parseInt(formData.fromQuestion) : null,
      toQuestion: formData.toQuestion ? parseInt(formData.toQuestion) : null,
      timeLimit: Math.round(totalTimeInSeconds / 60), // Convert to minutes
      timeInSeconds: totalTimeInSeconds
    };

    onStartQuiz(quizConfig);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} color="text.primary" gutterBottom>
          Quiz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Answer the questions to the best of your ability
        </Typography>
      </Box>

      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[8],
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={600} color="primary" gutterBottom>
              Quiz Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select your exam preferences and time settings
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Select Quiz */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Select Quiz
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.selectedQuiz || ''}
                  onChange={(e) => handleInputChange('selectedQuiz', e.target.value)}
                  size="medium"
                  displayEmpty
                  error={!!errors.selectedQuiz}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a quiz
                  </MenuItem>
                  {examOptions.map((quiz) => (
                    <MenuItem key={quiz.id || quiz} value={quiz}>
                      {quiz.title || quiz}
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedQuiz && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.selectedQuiz}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Shuffle Option */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Shuffle Questions
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.shuffle}
                  onChange={(e) => handleInputChange('shuffle', e.target.value)}
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="Yes">Yes - Randomize question order</MenuItem>
                  <MenuItem value="No">No - Keep original order</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Question Range */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Question Range (Optional)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="From Question #"
                    type="number"
                    value={formData.fromQuestion}
                    onChange={(e) => handleInputChange('fromQuestion', e.target.value)}
                    InputProps={{ 
                      inputProps: { min: 1, max: 60 },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                      }
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="To Question #"
                    type="number"
                    value={formData.toQuestion}
                    onChange={(e) => handleInputChange('toQuestion', e.target.value)}
                    error={!!errors.toQuestion}
                    helperText={errors.toQuestion}
                    InputProps={{ 
                      inputProps: { min: 1, max: 60 },
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                      }
                    }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Time Limit */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Time Limit
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Hours
                    </Typography>
                    <Select
                      value={formData.hours}
                      onChange={(e) => handleInputChange('hours', parseInt(e.target.value))}
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                      }}
                    >
                      {hourOptions.map((hour) => (
                        <MenuItem key={hour} value={hour}>
                          {hour} {hour === 1 ? 'hour' : 'hours'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Minutes
                    </Typography>
                    <Select
                      value={formData.minutes}
                      onChange={(e) => handleInputChange('minutes', parseInt(e.target.value))}
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                      }}
                    >
                      {minuteOptions.map((minute) => (
                        <MenuItem key={minute} value={minute}>
                          {minute} {minute === 1 ? 'minute' : 'minutes'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Seconds
                    </Typography>
                    <Select
                      value={formData.seconds}
                      onChange={(e) => handleInputChange('seconds', parseInt(e.target.value))}
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                      }}
                    >
                      {secondOptions.map((second) => (
                        <MenuItem key={second} value={second}>
                          {second} {second === 1 ? 'second' : 'seconds'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {Object.values(errors).map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <StartIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: theme.shadows[8],
                  '&:hover': {
                    boxShadow: theme.shadows[12],
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                {loading ? 'Starting Quiz...' : 'Start Quiz'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

StartQuizForm.propTypes = {
  availableQuizzes: PropTypes.array,
  onStartQuiz: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default StartQuizForm;
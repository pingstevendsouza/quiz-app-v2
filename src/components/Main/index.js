import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Paper,
  FormControlLabel,
  Switch,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Timer,
  Shuffle,
  Settings,
} from '@mui/icons-material';

import {
  COUNTDOWN_TIME,
  EXAMS
} from '../../constants';
import { shuffle } from '../../utils';
import { QuizAnimation } from '../Animations';

const Main = ({ startQuiz }) => {
  const theme = useTheme();
  const [exam, setExam] = useState("CSA");
  const [numOfQuestions, setNumOfQuestions] = useState(60);
  const [doShuffle, setShuffle] = useState('no');
  const [fromVal, setFromVal] = useState(1);
  const [toVal, setToVal] = useState(60);
  const [countdownTime, setCountdownTime] = useState({
    hours: 3600,
    minutes: 1800,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleTimeChange = (name, value) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    exam &&
    numOfQuestions &&
    doShuffle &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  const fetchData = async () => {
    if (error) setError(null);
    let data = {};
    
    setProcessing(true);
    
    try {
      const response = await fetch('/api/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: `${exam}.json`, type: "json" }),
      });

      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error('Failed to fetch quiz data');
      }

      const { response_code, results } = data;

      if (response_code === 404) {
        const message = 'The selected exam does not have enough questions. Please try another exam.';
        setProcessing(false);
        setError(message);
        return;
      }

      results.forEach(element => {
        const options = [...new Set([...element.correct_answers, ...element.incorrect_answers])];
        element.options = shuffle(options);
      });
      
      let resultsMixed = doShuffle === "yes" ? shuffle(results) : results.slice(fromVal - 1, toVal);
      resultsMixed.length = doShuffle === "yes" ? numOfQuestions : resultsMixed.length;

      setProcessing(false);
      startQuiz(
        resultsMixed,
        countdownTime.hours + countdownTime.minutes + countdownTime.seconds
      );
    } catch (error) {
      setProcessing(false);
      setError(error.message || 'An error occurred while loading the quiz.');
    }
  };

  const getTotalTime = () => {
    const totalSeconds = countdownTime.hours + countdownTime.minutes + countdownTime.seconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Card
          sx={{
            boxShadow: theme.shadows[8],
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
              <QuizAnimation size={200} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
              Configure Your Quiz
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, color: 'white', fontSize: '1.1rem' }}>
              Customize your quiz settings and start practicing
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Exam Selection */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary }}>
                    <Settings color="primary" />
                    Exam Selection
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Select Exam</InputLabel>
                    <Select
                      value={exam}
                      label="Select Exam"
                      onChange={(e) => setExam(e.target.value)}
                      disabled={processing}
                    >
                      {EXAMS.map((examOption) => (
                        <MenuItem key={examOption.value} value={examOption.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {examOption.text}
                            {examOption.value === 'CSA' && (
                              <Chip label="Popular" size="small" color="primary" />
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Shuffle Settings */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary }}>
                    <Shuffle color="primary" />
                    Question Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={doShuffle === 'yes'}
                        onChange={(e) => setShuffle(e.target.checked ? 'yes' : 'no')}
                        disabled={processing}
                      />
                    }
                    label="Shuffle Questions"
                    sx={{ mt: 2, mb: 2 }}
                  />

                  {doShuffle === 'no' ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="From Question #"
                          type="number"
                          value={fromVal}
                          onChange={(e) => setFromVal(parseInt(e.target.value) || 1)}
                          InputProps={{ inputProps: { min: 1 } }}
                          disabled={processing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="To Question #"
                          type="number"
                          value={toVal}
                          onChange={(e) => setToVal(parseInt(e.target.value) || 60)}
                          InputProps={{ inputProps: { min: 1 } }}
                          disabled={processing}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <Typography gutterBottom sx={{ color: theme.palette.text.primary }}>
                        Number of Questions: <strong>{numOfQuestions}</strong>
                      </Typography>
                      <Slider
                        value={numOfQuestions}
                        onChange={(e, value) => setNumOfQuestions(value)}
                        min={10}
                        max={100}
                        step={10}
                        marks
                        valueLabelDisplay="auto"
                        disabled={processing}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Timer Settings */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary }}>
                    <Timer color="primary" />
                    Timer Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Total Time: <strong>{getTotalTime()}</strong>
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Hours</InputLabel>
                        <Select
                          value={countdownTime.hours}
                          label="Hours"
                          onChange={(e) => handleTimeChange('hours', e.target.value)}
                          disabled={processing}
                        >
                          {COUNTDOWN_TIME.hours.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Minutes</InputLabel>
                        <Select
                          value={countdownTime.minutes}
                          label="Minutes"
                          onChange={(e) => handleTimeChange('minutes', e.target.value)}
                          disabled={processing}
                        >
                          {COUNTDOWN_TIME.minutes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Seconds</InputLabel>
                        <Select
                          value={countdownTime.seconds}
                          label="Seconds"
                          onChange={(e) => handleTimeChange('seconds', e.target.value)}
                          disabled={processing}
                        >
                          {COUNTDOWN_TIME.seconds.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Start Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                  onClick={fetchData}
                  disabled={!allFieldsSelected || processing}
                  sx={{
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    background: allFieldsSelected && !processing
                      ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`
                      : undefined,
                    boxShadow: allFieldsSelected && !processing
                      ? '0 3px 15px 2px rgba(94, 114, 228, .3)'
                      : undefined,
                    '&:hover': {
                      transform: allFieldsSelected && !processing ? 'translateY(-2px)' : undefined,
                      boxShadow: allFieldsSelected && !processing
                        ? '0 6px 20px 2px rgba(94, 114, 228, .3)'
                        : undefined,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {processing ? 'Loading Quiz...' : 'Start Quiz'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import Home from '@mui/icons-material/Home';
import TrendingUp from '@mui/icons-material/TrendingUp';
import School from '@mui/icons-material/School';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Timer from '@mui/icons-material/Timer';
import ShareButton from '../ShareButton';
import { calculateScore, calculateGrade, timeConverter } from '../../utils';
import { SuccessAnimation } from '../Animations';

const Stats = ({
  totalQuestions,
  correctAnswers,
  timeTaken,
  replayQuiz,
  resetQuiz,
}) => {
  const theme = useTheme();
  const score = calculateScore(totalQuestions, correctAnswers);
  const { grade, remarks } = calculateGrade(score);
  const { hours, minutes, seconds } = timeConverter(timeTaken);
  const passed = score >= 60;

  const StatCard = ({ icon, label, value, color = 'primary' }) => (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 48,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px 0 ${alpha(theme.palette[color].main, 0.4)}`,
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ pt: 5, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Main Result Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
          boxShadow: theme.shadows[8],
        }}
      >
        <Box
          sx={{
            background: passed
              ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: 'white',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
            <SuccessAnimation size={150} />
          </Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {remarks}
          </Typography>
          <Chip
            label={`Grade: ${grade}`}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              py: 2,
              px: 3,
            }}
          />
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Score Progress */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                Your Score
              </Typography>
              <Typography variant="body1" fontWeight={600} color={passed ? 'success.main' : 'error.main'}>
                {score}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: passed
                    ? `linear-gradient(90deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
                    : `linear-gradient(90deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Passing Score: 60%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {passed ? 'Passed!' : 'Not Passed'}
              </Typography>
            </Box>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatCard
                icon={<School sx={{ color: 'white', fontSize: 24 }} />}
                label="Total Questions"
                value={totalQuestions}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                icon={<CheckCircle sx={{ color: 'white', fontSize: 24 }} />}
                label="Correct Answers"
                value={correctAnswers}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                icon={<Timer sx={{ color: 'white', fontSize: 24 }} />}
                label="Time Taken"
                value={`${Number(hours)}h ${Number(minutes)}m ${Number(seconds)}s`}
                color="info"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Replay />}
              onClick={replayQuiz}
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: '0 3px 15px 2px rgba(94, 114, 228, .3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px 2px rgba(94, 114, 228, .3)',
                },
              }}
            >
              Play Again
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={resetQuiz}
              sx={{
                px: 4,
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Back to Home
            </Button>
            <ShareButton />
          </Box>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[3] }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            Performance Insights
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.background.default }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accuracy Rate
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.background.default }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Time per Question
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {Math.floor(timeTaken / totalQuestions / 1000)}s
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

Stats.propTypes = {
  totalQuestions: PropTypes.number.isRequired,
  correctAnswers: PropTypes.number.isRequired,
  timeTaken: PropTypes.number.isRequired,
  replayQuiz: PropTypes.func.isRequired,
  resetQuiz: PropTypes.func.isRequired,
};

export default Stats;

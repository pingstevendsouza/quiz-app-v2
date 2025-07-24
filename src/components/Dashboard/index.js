import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Timer,
  CheckCircle,
  Cancel,
  School,
  EmojiEvents,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const Dashboard = () => {
  const theme = useTheme();

  // Mock data - in a real app, this would come from your state/backend
  const stats = {
    totalQuizzes: 24,
    averageScore: 78,
    passRate: 83,
    totalTime: '42h 30m',
    recentQuizzes: [
      { name: 'CSA Exam', score: 85, date: '2024-01-15', passed: true },
      { name: 'CAD Exam', score: 72, date: '2024-01-14', passed: true },
      { name: 'ITSM Exam', score: 45, date: '2024-01-13', passed: false },
      { name: 'CSA Practice', score: 90, date: '2024-01-12', passed: true },
    ],
    scoreDistribution: [
      { score: '0-20', count: 2 },
      { score: '21-40', count: 3 },
      { score: '41-60', count: 5 },
      { score: '61-80', count: 8 },
      { score: '81-100', count: 6 },
    ],
    examPerformance: [
      { id: 0, value: 12, label: 'CSA' },
      { id: 1, value: 8, label: 'CAD' },
      { id: 2, value: 4, label: 'ITSM' },
    ],
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card
      sx={{
        height: '100%',
        boxShadow: theme.shadows[3],
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          width: 64,
          height: 64,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${color} 0%, ${theme.palette[color].dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px 0 rgba(0,0,0,0.14)`,
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ pt: 6 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ textAlign: 'right', fontWeight: 600, mt: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
            <Typography variant="caption" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Quizzes"
            value={stats.totalQuizzes}
            icon={<School sx={{ color: 'white', fontSize: 32 }} />}
            color="primary"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon={<EmojiEvents sx={{ color: 'white', fontSize: 32 }} />}
            color="success"
            trend="+5% improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            icon={<CheckCircle sx={{ color: 'white', fontSize: 32 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Time"
            value={stats.totalTime}
            icon={<Timer sx={{ color: 'white', fontSize: 32 }} />}
            color="warning"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Score Distribution
              </Typography>
              <BarChart
                series={[
                  {
                    data: stats.scoreDistribution.map(item => item.count),
                    color: theme.palette.primary.main,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: 'band',
                    data: stats.scoreDistribution.map(item => item.score),
                  },
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Exam Distribution
              </Typography>
              <PieChart
                series={[
                  {
                    data: stats.examPerformance,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Quiz Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stats.recentQuizzes.map((quiz, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: quiz.passed ? 'success.light' : 'error.light',
                          color: quiz.passed ? 'success.dark' : 'error.dark',
                        }}
                      >
                        {quiz.passed ? <CheckCircle /> : <Cancel />}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {quiz.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(quiz.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={600}>
                          {quiz.score}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={quiz.score}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: quiz.score >= 60 ? 'success.main' : 'error.main',
                            },
                          }}
                        />
                      </Box>
                      <Chip
                        label={quiz.passed ? 'Passed' : 'Failed'}
                        color={quiz.passed ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 
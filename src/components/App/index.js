import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';

import theme from '../../theme';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import DashboardLayout from '../DashboardLayout';
import Loader from '../Loader';
import Upload from '../Upload';
import Main from '../Main';
import ModernQuiz from '../Quiz/ModernQuiz';
import Result from '../Result';
import Dashboard from '../Dashboard';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import Profile from '../Profile';
import { shuffle } from '../../utils';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 2,
      p: 3,
      textAlign: 'center'
    }}
  >
    <Typography variant="h4" color="error" gutterBottom>
      Something went wrong
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {error.message}
    </Typography>
    <Button variant="contained" onClick={resetErrorBoundary}>
      Try again
    </Button>
  </Box>
);

const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const handleMenuSelect = (item) => {
    setSelectedItem(item);
  };

  const startQuiz = (quizData, time) => {
    setLoading(true);
    setLoadingMessage({
      title: 'Loading your quiz...',
      message: "It won't be long!",
    });
    setCountdownTime(time);

    setTimeout(() => {
      setData(quizData);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  const endQuiz = (results) => {
    setLoading(true);
    setLoadingMessage({
      title: 'Fetching your results...',
      message: 'Just a moment!',
    });

    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(results);
      setLoading(false);
    }, 2000);
  };

  const replayQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: 'Getting ready for round two.',
      message: "It won't take long!",
    });

    const shuffledData = shuffle(data);
    shuffledData.forEach(element => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: 'Loading the home screen.',
      message: 'Thank you for playing!',
    });

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signin"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignUp />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute requireAuth={true}>
            <DashboardLayout onMenuSelect={handleMenuSelect} selectedItem={selectedItem}>
              {/* Profile Component in Header */}
              <Box sx={{ position: 'absolute', top: 16, right: 24, zIndex: 1201 }}>
                <Profile />
              </Box>

              {/* Main Content */}
              {loading && <Loader {...loadingMessage} />}
              
              {!loading && selectedItem === 'Dashboard' && !isQuizStarted && !isQuizCompleted && (
                <Dashboard />
              )}
              
              {!loading && selectedItem === 'Update' && !isQuizStarted && !isQuizCompleted && (
                <Upload />
              )}
              
              {!loading && selectedItem === 'Create' && !isQuizStarted && !isQuizCompleted && (
                <Main startQuiz={startQuiz} />
              )}
              
              {!loading && isQuizStarted && (
                <ModernQuiz 
                  data={data} 
                  countdownTime={countdownTime} 
                  endQuiz={endQuiz} 
                />
              )}
              
              {!loading && isQuizCompleted && (
                <Result 
                  {...resultData} 
                  replayQuiz={replayQuiz} 
                  resetQuiz={resetQuiz} 
                />
              )}
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              gap: 2
            }}
          >
            <Typography variant="h3" color="primary">
              404
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Page not found
            </Typography>
            <Button variant="contained" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </Box>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

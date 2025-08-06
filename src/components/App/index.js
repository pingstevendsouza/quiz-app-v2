import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
// Import providers
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AppProvider } from '../../contexts/AppContext';
import '../../i18n';

import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import { DashboardLayout } from '../Layout';
import GlobalLoader from '../GlobalLoader';
import NotificationSystem from '../NotificationSystem';
import Loader from '../Loader';
import Upload from '../Upload';
import Main from '../Main';
import ModernQuiz from '../Quiz/ModernQuiz';
import Quiz from '../Quiz'; // Original Quiz component
import Result from '../Result';
import Dashboard from '../Dashboard';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import StartQuizForm from '../Quiz/StartQuizForm';
import AIFormBuilderPage from '../../pages/AIFormBuilderPage.jsx';
import UserProfile from '../../pages/UserProfile';
import mockQuizData from '../Quiz/mock.json';

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
  const [, setQuizConfig] = useState(null);
  const [useOriginalQuiz, setUseOriginalQuiz] = useState(true);

  const handleMenuSelect = (item) => {
    setSelectedItem(item);
    // Reset quiz state when navigating away from quiz
    if (item !== 'quiz-start' && item !== 'Create') {
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setData(null);
      setQuizConfig(null);
    }
  };

  // Transform mock data to match original quiz format
  const transformQuizData = (mockData) => {
    return mockData.map(item => ({
      ...item,
      correct_answers: [item.correct_answer], // Convert to array format expected by original Quiz
      options: item.options || [item.correct_answer, ...item.incorrect_answers]
    }));
  };

  // Available quizzes for Start Quiz form (now handled by StartQuizForm component)
  // The quiz data is now organized by type within the StartQuizForm component
  const availableQuizzes = [];

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

  // Handle Start Quiz form submission
  const handleStartQuiz = (formData) => {
    setLoading(true);
    setLoadingMessage({
      title: `Starting "${formData.selectedQuiz.title}" quiz...`,
      message: "Get ready to test your knowledge!",
    });
    
    // Store quiz configuration
    setQuizConfig(formData);
    
    // Set quiz data and time
    // For now, use mock data since we don't have actual quiz questions for each certification
    // In a real application, you would fetch the actual questions based on the selected quiz
    const quizData = transformQuizData(mockQuizData);
    const timeLimit = formData.timeLimit ? formData.timeLimitValue * 60 : 300; // Convert minutes to seconds
    
    setData(quizData);
    setCountdownTime(timeLimit);
    setUseOriginalQuiz(true); // Use original Quiz component for Start Quiz flow
    
    setTimeout(() => {
      setIsQuizStarted(true);
      setLoading(false);
    }, 1500);
  };

  // Handle Start Quiz form cancel
  const handleCancelStartQuiz = () => {
    setSelectedItem('Dashboard');
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
        path="/"
        element={
          <ProtectedRoute requireAuth={true}>
            <DashboardLayout onMenuSelect={handleMenuSelect} selectedItem={selectedItem}>
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
              
              {!loading && selectedItem === 'quiz-start' && !isQuizStarted && !isQuizCompleted && (
                <StartQuizForm
                  availableQuizzes={availableQuizzes}
                  onStartQuiz={handleStartQuiz}
                  onCancel={handleCancelStartQuiz}
                  loading={loading}
                />
              )}
              
              {!loading && isQuizStarted && useOriginalQuiz && (
                <Quiz 
                  data={data} 
                  countdownTime={countdownTime} 
                  endQuiz={endQuiz} 
                />
              )}
              
              {!loading && isQuizStarted && !useOriginalQuiz && (
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
      <Route
        path="/ai-form-builder"
        element={
          <ProtectedRoute requireAuth={true}>
            <DashboardLayout onMenuSelect={handleMenuSelect} selectedItem="AI Form Builder">
              <AIFormBuilderPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <UserProfile />
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
      {/* ThemeProvider for light/dark mode */}
      <ThemeProvider>
        {/* AppProvider for global state management */}
        <AppProvider>
          {/* AuthProvider for authentication */}
          <AuthProvider>
            {/* Global components */}
            <GlobalLoader />
            <NotificationSystem />
            <AppContent />
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

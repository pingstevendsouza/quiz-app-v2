import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import StartQuizForm from '../components/Quiz/StartQuizForm';
import Quiz from '../components/Quiz'; // Original Quiz component
import ModernQuiz from '../components/Quiz/ModernQuiz'; // Modern Quiz component
import DashboardLayout from '../components/Layout/DashboardLayout';
import mockQuizData from '../components/Quiz/mock.json';

const StartQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizData, setQuizData] = useState([]);

  // Transform mock data to match original quiz format
  const transformQuizData = (mockData) => {
    return mockData.map(item => ({
      ...item,
      correct_answers: [item.correct_answer], // Convert to array format expected by original Quiz
      options: item.options || [item.correct_answer, ...item.incorrect_answers]
    }));
  };

  // Mock available quizzes - in real app, this would come from API
  const availableQuizzes = [
    {
      id: 1,
      title: 'Computer Science Fundamentals',
      description: 'Test your knowledge of computer science basics and programming concepts',
      questionCount: mockQuizData.length,
      estimatedDuration: 15,
      difficulty: 'Mixed',
      category: 'Computer Science',
      data: transformQuizData(mockQuizData)
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and ES6 features',
      questionCount: 25,
      estimatedDuration: 30,
      difficulty: 'Beginner',
      category: 'Programming',
      data: transformQuizData(mockQuizData.slice(0, 10)) // Use subset for demo
    },
    {
      id: 3,
      title: 'React Advanced Concepts',
      description: 'Advanced React patterns, hooks, context, and performance optimization',
      questionCount: 15,
      estimatedDuration: 20,
      difficulty: 'Advanced',
      category: 'Frontend',
      data: transformQuizData(mockQuizData.slice(5, 15)) // Use subset for demo
    },
    {
      id: 4,
      title: 'CSS and Web Design',
      description: 'Modern CSS layout techniques for responsive web design',
      questionCount: 12,
      estimatedDuration: 18,
      difficulty: 'Intermediate',
      category: 'Frontend',
      data: transformQuizData(mockQuizData.slice(8, 15)) // Use subset for demo
    },
    {
      id: 5,
      title: 'Database and Backend',
      description: 'Database design, server-side programming, and API development',
      questionCount: 18,
      estimatedDuration: 25,
      difficulty: 'Advanced',
      category: 'Backend',
      data: transformQuizData(mockQuizData.slice(10)) // Use remaining questions
    }
  ];

  const handleStartQuiz = async (formData) => {
    setLoading(true);
    
    try {
      // Simulate API call to start quiz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Starting quiz with configuration:', formData);
      
      // Set quiz configuration and data
      setQuizConfig(formData);
      setQuizData(formData.selectedQuiz.data || transformQuizData(mockQuizData));
      
      // Show success message
      setNotification({
        open: true,
        message: `Starting "${formData.selectedQuiz.title}" quiz...`,
        severity: 'success'
      });
      
      // Start the quiz
      setTimeout(() => {
        setQuizStarted(true);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting quiz:', error);
      setNotification({
        open: true,
        message: 'Failed to start quiz. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (quizStarted) {
      // If quiz is started, go back to form
      setQuizStarted(false);
      setQuizConfig(null);
      setQuizData([]);
    } else {
      // If on form, go back to dashboard
      navigate('/dashboard');
    }
  };

  // Handle quiz completion (original Quiz component callback)
  const handleQuizEnd = (results) => {
    console.log('Quiz completed with results:', results);
    
    // Show completion notification
    setNotification({
      open: true,
      message: `Quiz completed! Score: ${results.correctAnswers}/${results.totalQuestions}`,
      severity: 'success'
    });
    
    // Reset quiz state
    setTimeout(() => {
      setQuizStarted(false);
      setQuizConfig(null);
      setQuizData([]);
      
      // Navigate to results page or dashboard
      navigate('/dashboard', {
        state: {
          quizResults: results,
          quizConfig: quizConfig
        }
      });
    }, 2000);
  };

  // Handle modern quiz completion (ModernQuiz component callback)
  const handleModernQuizComplete = (results) => {
    console.log('Modern quiz completed with results:', results);
    
    // Transform results to match original format
    const transformedResults = {
      totalQuestions: quizData.length,
      correctAnswers: Math.round((results.score / results.total) * quizData.length),
      timeTaken: results.timeSpent,
      questionsAndAnswers: [] // Would need to be populated based on results.answers
    };
    
    handleQuizEnd(transformedResults);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // If quiz is started, render the quiz component
  if (quizStarted && quizConfig && quizData.length > 0) {
    const timeLimit = quizConfig.timeLimit ? quizConfig.timeLimitValue * 60 : 300; // Convert minutes to seconds, default 5 min
    
    return (
      <DashboardLayout 
        selectedItem="quiz-start" 
        title={`Quiz: ${quizConfig.selectedQuiz.title}`}
        onMenuSelect={(item) => {
          // Handle navigation to other menu items during quiz
          console.log('Navigation blocked during quiz:', item);
        }}
      >
        {/* Use original Quiz component with proper props */}
        <Quiz
          data={quizData}
          countdownTime={timeLimit}
          endQuiz={handleQuizEnd}
        />
      </DashboardLayout>
    );
  }

  // Default: render the start quiz form
  return (
    <DashboardLayout 
      selectedItem="quiz-start" 
      title="Start Quiz"
      onMenuSelect={(item) => {
        // Handle navigation to other menu items
        switch (item) {
          case 'dashboard':
            navigate('/dashboard');
            break;
          case 'quiz-manage':
            navigate('/quizzes');
            break;
          case 'quiz-results':
            navigate('/results');
            break;
          case 'analytics':
            navigate('/analytics');
            break;
          default:
            console.log('Navigation to:', item);
        }
      }}
    >
      <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
        <StartQuizForm
          availableQuizzes={availableQuizzes}
          onStartQuiz={handleStartQuiz}
          onCancel={handleCancel}
          loading={loading}
        />
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default StartQuiz;

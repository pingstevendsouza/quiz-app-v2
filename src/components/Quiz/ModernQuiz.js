import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Slide,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Timer,
  CheckCircle,
  RadioButtonUnchecked,
  ArrowForward,
  ArrowBack,
  Flag,
  Lightbulb
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ModernQuiz = ({ data, countdownTime, endQuiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(countdownTime * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { user } = useAuth();

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return 'error'; // Less than 5 minutes
    if (timeLeft < 600) return 'warning'; // Less than 10 minutes
    return 'primary';
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowHint(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowHint(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    // Calculate results
    let correctAnswers = 0;
    const results = data.map((question, index) => {
      const selectedOption = selectedAnswers[index];
      const isCorrect = selectedOption === question.answer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        selectedAnswer: selectedOption !== undefined ? question.options[selectedOption] : 'Not answered',
        correctAnswer: question.options[question.answer],
        isCorrect
      };
    });

    const resultData = {
      score: correctAnswers,
      totalQuestions: data.length,
      percentage: Math.round((correctAnswers / data.length) * 100),
      timeTaken: countdownTime * 60 - timeLeft,
      results
    };

    // Simulate API call delay
    setTimeout(() => {
      endQuiz(resultData);
    }, 1500);
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(selectedAnswers).length;
    return (answeredQuestions / data.length) * 100;
  };

  const currentQuestionData = data[currentQuestion];
  const isLastQuestion = currentQuestion === data.length - 1;
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  if (isSubmitting) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          gap: 3
        }}
      >
        <CircularProgress size={80} />
        <Typography variant="h5" fontWeight={600}>
          Submitting your quiz...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we calculate your results
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user?.picture} alt={user?.name}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Quiz in Progress
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user?.name || 'Anonymous User'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Timer />
            <Typography variant="h6" fontWeight={600} color={getTimeColor()}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Question {currentQuestion + 1} of {data.length}
            </Typography>
            <Typography variant="body2">
              {Math.round(getProgressPercentage())}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressPercentage()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Question Card */}
      <Slide direction="left" in={true} key={currentQuestion}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Question Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Chip
                label={`Question ${currentQuestion + 1}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <IconButton
                onClick={() => setShowHint(!showHint)}
                color="primary"
                sx={{ ml: 2 }}
              >
                <Lightbulb />
              </IconButton>
            </Box>

            {/* Question Text */}
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                mb: 4,
                lineHeight: 1.4,
                color: 'text.primary'
              }}
            >
              {currentQuestionData.question}
            </Typography>

            {/* Hint */}
            {showHint && currentQuestionData.hint && (
              <Fade in={showHint}>
                <Alert
                  severity="info"
                  sx={{ mb: 3, borderRadius: 2 }}
                  icon={<Lightbulb />}
                >
                  <Typography variant="body2">
                    <strong>Hint:</strong> {currentQuestionData.hint}
                  </Typography>
                </Alert>
              </Fade>
            )}

            {/* Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentQuestionData.options.map((option, index) => (
                <Fade in={true} timeout={300 + index * 100} key={index}>
                  <Paper
                    elevation={selectedAnswers[currentQuestion] === index ? 4 : 1}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: selectedAnswers[currentQuestion] === index 
                        ? 'primary.main' 
                        : 'transparent',
                      backgroundColor: selectedAnswers[currentQuestion] === index 
                        ? 'primary.50' 
                        : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        backgroundColor: 'primary.25',
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {selectedAnswers[currentQuestion] === index ? (
                        <CheckCircle color="primary" />
                      ) : (
                        <RadioButtonUnchecked color="action" />
                      )}
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: selectedAnswers[currentQuestion] === index ? 600 : 400,
                          color: selectedAnswers[currentQuestion] === index 
                            ? 'primary.main' 
                            : 'text.primary'
                        }}
                      >
                        {option}
                      </Typography>
                    </Box>
                  </Paper>
                </Fade>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Slide>

      {/* Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {data.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: selectedAnswers[index] !== undefined 
                  ? 'success.main' 
                  : index === currentQuestion 
                    ? 'primary.main' 
                    : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
              onClick={() => setCurrentQuestion(index)}
            />
          ))}
        </Box>

        {isLastQuestion ? (
          <Button
            variant="contained"
            startIcon={<Flag />}
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length === 0}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleNextQuestion}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Next
          </Button>
        )}
      </Box>

      {/* Quick Stats */}
      <Paper
        elevation={2}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={600} color="primary">
              {Object.keys(selectedAnswers).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Answered
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h6" fontWeight={600} color="warning.main">
              {data.length - Object.keys(selectedAnswers).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Remaining
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h6" fontWeight={600} color="success.main">
              {Math.round(getProgressPercentage())}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ModernQuiz;

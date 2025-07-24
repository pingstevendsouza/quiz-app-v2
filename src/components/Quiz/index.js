import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Divider,
  useTheme,
  Fade,
  Slide,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import he from 'he';

import QuizQuestion from './QuizQuestion';
import Countdown from '../Countdown';

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const theme = useTheme();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSelectedAns, setUserSelectedAns] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [isMultipleChoice, setIsMultipleChoice] = useState(data[questionIndex].correct_answers.length > 1);

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMultipleChoice(data[questionIndex].correct_answers.length > 1);
  }, [questionIndex, data]);

  const handleAnswerSelect = (selectedOptions) => {
    const updatedAnswers = [...userSelectedAns];
    updatedAnswers[questionIndex] = selectedOptions;
    setUserSelectedAns(updatedAnswers);
  };

  const handleNext = () => {
    let point = 0;
    if (userSelectedAns[questionIndex]) {
      if (isMultipleChoice) {
        const userAnswers = userSelectedAns[questionIndex] || [];
        const correctAnswers = data[questionIndex].correct_answers;
        
        const userSet = new Set(userAnswers);
        const correctSet = new Set(correctAnswers);
        
        if (userSet.size === correctSet.size && 
            [...userSet].every(answer => correctSet.has(answer))) {
          point = 1;
        }
      } else {
        if (userSelectedAns[questionIndex][0] === data[questionIndex].correct_answers[0]) {
          point = 1;
        }
      }
    }

    const qna = {
      question: he.decode(data[questionIndex].question),
      user_answer: userSelectedAns[questionIndex] ? 
        (Array.isArray(userSelectedAns[questionIndex]) ? 
          userSelectedAns[questionIndex].join(', ') : 
          userSelectedAns[questionIndex]) : 
        'Not Answered',
      correct_answer: data[questionIndex].correct_answers.join(', '),
      point,
    };

    setQuestionsAndAnswers([...questionsAndAnswers, qna]);
    setCorrectAnswers(correctAnswers + point);

    if (questionIndex === data.length - 1) {
      endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: [...questionsAndAnswers, qna],
      });
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const timeOver = timeTaken => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  // Decode options
  const currentQuestion = {
    ...data[questionIndex],
    question: he.decode(data[questionIndex].question),
    options: data[questionIndex].options.map(option => he.decode(option))
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Fade in timeout={500}>
        <Box>
          <Card sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            overflow: 'visible',
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={600} color="primary">
                  Question {questionIndex + 1} of {data.length}
                </Typography>
                {isMultipleChoice && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: theme.palette.info.light,
                      color: theme.palette.info.dark,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 500,
                    }}
                  >
                    Multiple Choice
                  </Typography>
                )}
              </Box>
              <Countdown
                countdownTime={countdownTime}
                timeOver={timeOver}
                setTimeTaken={setTimeTaken}
              />
            </CardContent>
          </Card>

          <Slide direction="up" in timeout={300}>
            <Box>
              <QuizQuestion
                question={currentQuestion}
                questionIndex={questionIndex}
                totalQuestions={data.length}
                selectedAnswers={userSelectedAns[questionIndex]}
                onAnswerSelect={handleAnswerSelect}
                isMultipleChoice={isMultipleChoice}
              />
            </Box>
          </Slide>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 3,
            }}
          >
            {questionIndex >= 1 ? (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrev}
                size="large"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Previous
              </Button>
            ) : (
              <Box /> // Empty box for spacing
            )}
            
            <Button
              variant="contained"
              endIcon={questionIndex === data.length - 1 ? <CheckCircle /> : <ArrowForward />}
              onClick={handleNext}
              size="large"
              color={questionIndex === data.length - 1 ? "success" : "primary"}
              disabled={!userSelectedAns[questionIndex]?.length}
              sx={{
                px: 4,
                py: 1.5,
                background: questionIndex === data.length - 1
                  ? `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`
                  : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: '0 3px 15px 2px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px 2px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {questionIndex === data.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;

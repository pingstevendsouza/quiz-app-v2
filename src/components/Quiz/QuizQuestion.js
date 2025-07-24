import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

const QuizQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswers,
  onAnswerSelect,
  isMultipleChoice,
}) => {
  const theme = useTheme();

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const handleSingleChoice = (event) => {
    onAnswerSelect([event.target.value]);
  };

  const handleMultipleChoice = (option) => {
    const currentAnswers = selectedAnswers || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(ans => ans !== option)
      : [...currentAnswers, option];
    onAnswerSelect(newAnswers);
  };

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[8],
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
        maxWidth: 900,
        mx: 'auto',
      }}
    >
      {/* Progress Bar */}
      <Box sx={{ position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 4,
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: `${progress}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.3s ease',
          }}
        >
          <Chip
            label={`${questionIndex + 1} / ${totalQuestions}`}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/* Question Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Question {questionIndex + 1}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, fontWeight: 600, lineHeight: 1.5 }}>
            {question.question}
          </Typography>
          {isMultipleChoice && (
            <Chip
              label="Multiple Choice"
              size="small"
              color="info"
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        {/* Answer Options */}
        <Box sx={{ mt: 3 }}>
          {isMultipleChoice ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers?.includes(option) || false;
                const letter = String.fromCharCode(65 + index);
                
                return (
                  <Box
                    key={index}
                    onClick={() => handleMultipleChoice(option)}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                      backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<CheckCircle />}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Typography
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[200],
                          color: isSelected ? 'white' : theme.palette.text.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {letter}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
                          fontWeight: isSelected ? 500 : 400,
                        }}
                      >
                        {option}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <RadioGroup value={selectedAnswers?.[0] || ''} onChange={handleSingleChoice}>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers?.[0] === option;
                const letter = String.fromCharCode(65 + index);
                
                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2.5,
                      borderRadius: 2,
                      border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                      backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.text.secondary,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[200],
                              color: isSelected ? 'white' : theme.palette.text.secondary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {letter}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
                              fontWeight: isSelected ? 500 : 400,
                            }}
                          >
                            {option}
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>
                );
              })}
            </RadioGroup>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

QuizQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  selectedAnswers: PropTypes.array,
  onAnswerSelect: PropTypes.func.isRequired,
  isMultipleChoice: PropTypes.bool.isRequired,
};

export default QuizQuestion; 
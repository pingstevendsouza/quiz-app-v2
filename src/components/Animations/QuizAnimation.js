import React from 'react';
import Lottie from 'lottie-react';
import quizAnimation from './quiz.json';

const QuizAnimation = ({ size = 200 }) => {
  return (
    <Lottie
      animationData={quizAnimation}
      style={{ width: size, height: size }}
      loop={true}
      autoplay={true}
    />
  );
};

export default QuizAnimation; 
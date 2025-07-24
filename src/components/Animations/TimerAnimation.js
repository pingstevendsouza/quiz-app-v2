import React from 'react';
import Lottie from 'lottie-react';
import timerAnimation from './timer.json';

const TimerAnimation = ({ size = 200 }) => {
  return (
    <Lottie
      animationData={timerAnimation}
      style={{ width: size, height: size }}
      loop={true}
      autoplay={true}
    />
  );
};

export default TimerAnimation; 
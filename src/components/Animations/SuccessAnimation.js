import React from 'react';
import Lottie from 'lottie-react';
import successAnimation from './success.json';

const SuccessAnimation = ({ size = 200 }) => {
  return (
    <Lottie
      animationData={successAnimation}
      style={{ width: size, height: size }}
      loop={false}
      autoplay={true}
    />
  );
};

export default SuccessAnimation; 
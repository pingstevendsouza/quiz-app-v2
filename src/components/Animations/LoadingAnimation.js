import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from './loading.json';

const LoadingAnimation = ({ size = 200 }) => {
  return (
    <Lottie
      animationData={loadingAnimation}
      style={{ width: size, height: size }}
      loop={true}
      autoplay={true}
    />
  );
};

export default LoadingAnimation; 
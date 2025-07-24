import React from 'react';

// Simple CSS-based animations instead of Lottie
export const LoadingAnimation = ({ size = 100 }) => {
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #5e72e4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: 'auto'
      }}
    />
  );
};

export const TimerAnimation = ({ size = 100 }) => {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #e74c3c',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
          margin: 'auto'
        }}
      />
      <div 
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '40%',
          background: '#e74c3c',
          transform: 'translate(-50%, -100%)',
          transformOrigin: 'bottom center',
          animation: 'tick 2s linear infinite'
        }}
      />
    </div>
  );
};

export const QuizAnimation = ({ size = 200 }) => {
  return (
    <div style={{ width: size, height: size, textAlign: 'center' }}>
      <div 
        style={{ 
          width: '80%', 
          height: '80%', 
          background: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
          borderRadius: '20px',
          margin: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          boxShadow: '0 4px 20px rgba(94, 114, 228, 0.3)'
        }}
      >
        <span style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>🧠</span>
      </div>
    </div>
  );
};

export const SuccessAnimation = ({ size = 100 }) => {
  return (
    <div style={{ width: size, height: size, textAlign: 'center' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bounce 0.6s ease-in-out',
          boxShadow: '0 4px 20px rgba(46, 204, 113, 0.3)'
        }}
      >
        <span style={{ color: 'white', fontSize: '2rem' }}>✓</span>
      </div>
    </div>
  );
};

// Add CSS animations to the document
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes tick {
    0% { transform: translate(-50%, -100%) rotate(0deg); }
    100% { transform: translate(-50%, -100%) rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes bounce {
    0% { transform: scale(0.3); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style); 
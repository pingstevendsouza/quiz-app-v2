import React from 'react';

// Simple CSS-based animations instead of Lottie
export const LoadingAnimation = ({ size = 100 }) => {
  return (
    <div style={{ width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: '80%',
          height: '80%',
          background: 'linear-gradient(135deg, #5e72e4 0%, #324cdd 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(94, 114, 228, 0.3)'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
      </div>
    </div>
  );
};

export const TimerAnimation = ({ size = 100 }) => {
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        style={{ 
          width: '80%', 
          height: '80%', 
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      </div>
    </div>
  );
};

export const QuizAnimation = ({ size = 200 }) => {
  return (
    <div style={{ width: size, height: size, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          boxShadow: '0 4px 20px rgba(94, 114, 228, 0.3)'
        }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
      </div>
    </div>
  );
};

export const SuccessAnimation = ({ size = 100 }) => {
  return (
    <div style={{ width: size, height: size, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        style={{ 
          width: '80%', 
          height: '80%', 
          background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(46, 204, 113, 0.3)'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
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
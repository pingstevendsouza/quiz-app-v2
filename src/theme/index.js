import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5e72e4',
      light: '#8b92f8',
      dark: '#324cdd',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f4f5f7',
      light: '#ffffff',
      dark: '#c1c2c5',
      contrastText: '#344767',
    },
    success: {
      main: '#2dce89',
      light: '#66e0a7',
      dark: '#1a9f5f',
      contrastText: '#fff',
    },
    error: {
      main: '#f5365c',
      light: '#f76583',
      dark: '#d91a40',
      contrastText: '#fff',
    },
    warning: {
      main: '#fb6340',
      light: '#fc8966',
      dark: '#fa3412',
      contrastText: '#fff',
    },
    info: {
      main: '#11cdef',
      light: '#4dd9f2',
      dark: '#0bb7d9',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#344767',
      secondary: '#7b809a',
    },
    divider: '#e9ecef',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#344767',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#344767',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#344767',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#344767',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#344767',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#344767',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#7b809a',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#7b809a',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 9px -3px rgba(0,0,0,0.05)',
    '0 3px 10px -2px rgba(0,0,0,0.05)',
    '0 8px 10px -5px rgba(0,0,0,0.1)',
    '0 6px 30px -5px rgba(0,0,0,0.1)',
    '0 16px 24px 2px rgba(0,0,0,0.04)',
    '0 24px 32px 3px rgba(0,0,0,0.05)',
    '0 10px 40px -5px rgba(0,0,0,0.1)',
    '0 20px 25px -5px rgba(0,0,0,0.1)',
    '0 20px 40px -5px rgba(0,0,0,0.2)',
    '0 25px 50px -5px rgba(0,0,0,0.25)',
    '0 30px 60px -5px rgba(0,0,0,0.3)',
    '0 35px 70px -5px rgba(0,0,0,0.35)',
    '0 40px 80px -5px rgba(0,0,0,0.4)',
    '0 45px 90px -5px rgba(0,0,0,0.45)',
    '0 50px 100px -5px rgba(0,0,0,0.5)',
    '0 55px 110px -5px rgba(0,0,0,0.55)',
    '0 60px 120px -5px rgba(0,0,0,0.6)',
    '0 65px 130px -5px rgba(0,0,0,0.65)',
    '0 70px 140px -5px rgba(0,0,0,0.7)',
    '0 75px 150px -5px rgba(0,0,0,0.75)',
    '0 80px 160px -5px rgba(0,0,0,0.8)',
    '0 85px 170px -5px rgba(0,0,0,0.85)',
    '0 90px 180px -5px rgba(0,0,0,0.9)',
    '0 95px 190px -5px rgba(0,0,0,0.95)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: '0 3px 10px -2px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 30px -5px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(180deg, #5e72e4 0%, #324cdd 100%)',
          '&:hover': {
            background: 'linear-gradient(180deg, #324cdd 0%, #1a3ec8 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          overflow: 'visible',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 9px -3px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 3px 10px -2px rgba(0,0,0,0.05)',
        },
        elevation3: {
          boxShadow: '0 8px 10px -5px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#d2d6da',
            },
            '&:hover fieldset': {
              borderColor: '#7b809a',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5e72e4',
            },
          },
        },
      },
    },
  },
});

export default theme; 
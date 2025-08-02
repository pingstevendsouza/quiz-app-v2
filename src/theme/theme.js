// Mantis Dashboard-inspired professional theme configuration
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Color palette based on Mantis Dashboard
const PRIMARY = {
  lighter: '#E6F7FF',
  light: '#69BFFF',
  main: '#2196F3',
  dark: '#0B79D0',
  darker: '#065699',
  contrastText: '#FFFFFF'
};

const SECONDARY = {
  lighter: '#EDE7F6',
  light: '#B39DDB',
  main: '#673AB7',
  dark: '#5E35B1',
  darker: '#4527A0',
  contrastText: '#FFFFFF'
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: '#FFFFFF'
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: '#212B36'
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#FFFFFF'
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#FFFFFF'
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  main: '#637381',
  dark: '#454F5B',
  contrastText: '#FFFFFF',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161'
};

// Common settings for both light and dark themes
const commonSettings = {
  direction: 'ltr',
  typography: {
    fontFamily: '\'Public Sans\', sans-serif',
    fontFamilyCode: '\'Roboto Mono\', monospace',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 600,
      lineHeight: 1.25,
      fontSize: '2.5rem',
      letterSpacing: '-0.022em'
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.27,
      fontSize: '2rem',
      letterSpacing: '-0.02em'
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.3,
      fontSize: '1.625rem',
      letterSpacing: '-0.018em'
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.33,
      fontSize: '1.25rem',
      letterSpacing: '-0.017em'
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: '1.125rem',
      letterSpacing: '-0.015em'
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.57,
      fontSize: '0.875rem',
      letterSpacing: '-0.014em'
    },
    body1: {
      lineHeight: 1.5,
      fontSize: '0.875rem'
    },
    body2: {
      lineHeight: 1.57,
      fontSize: '0.75rem'
    },
    subtitle1: {
      lineHeight: 1.5,
      fontSize: '0.875rem'
    },
    subtitle2: {
      fontWeight: 500,
      lineHeight: 1.57,
      fontSize: '0.75rem'
    },
    caption: {
      lineHeight: 1.5,
      fontSize: '0.75rem'
    },
    overline: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: '0.75rem',
      textTransform: 'uppercase'
    },
    button: {
      fontWeight: 500,
      lineHeight: 1.71,
      fontSize: '0.875rem',
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 8
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  mixins: {
    toolbar: {
      minHeight: 64,
      '@media (min-width:600px)': {
        minHeight: 70
      },
      '@media (min-width:1280px)': {
        minHeight: 76
      }
    }
  }
};

// Light theme settings
const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: PRIMARY,
    secondary: SECONDARY,
    success: SUCCESS,
    info: INFO,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: GREY[200],
    common: {
      black: '#000000',
      white: '#FFFFFF'
    },
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500]
    },
    background: {
      paper: '#FFFFFF',
      default: GREY[100],
      neutral: GREY[200]
    },
    action: {
      active: GREY[600],
      hover: GREY[100],
      selected: GREY[200],
      disabled: GREY[300],
      disabledBackground: GREY[200],
      focus: GREY[200],
      hoverOpacity: 0.08,
      disabledOpacity: 0.48
    }
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 4px -1px rgba(0, 0, 0, 0.07)',
    '0 4px 6px -2px rgba(0, 0, 0, 0.08)',
    '0 6px 8px -3px rgba(0, 0, 0, 0.09)',
    '0 8px 12px -4px rgba(0, 0, 0, 0.10)',
    '0 12px 16px -6px rgba(0, 0, 0, 0.12)',
    '0 16px 24px -8px rgba(0, 0, 0, 0.14)',
    '0 20px 28px -10px rgba(0, 0, 0, 0.15)',
    '0 24px 32px -12px rgba(0, 0, 0, 0.16)',
    '0 28px 36px -14px rgba(0, 0, 0, 0.17)',
    '0 32px 40px -16px rgba(0, 0, 0, 0.18)',
    '0 36px 44px -18px rgba(0, 0, 0, 0.19)',
    '0 40px 48px -20px rgba(0, 0, 0, 0.20)',
    '0 44px 52px -22px rgba(0, 0, 0, 0.21)',
    '0 48px 56px -24px rgba(0, 0, 0, 0.22)',
    '0 52px 60px -26px rgba(0, 0, 0, 0.23)',
    '0 56px 64px -28px rgba(0, 0, 0, 0.24)',
    '0 60px 68px -30px rgba(0, 0, 0, 0.25)',
    '0 64px 72px -32px rgba(0, 0, 0, 0.26)',
    '0 68px 76px -34px rgba(0, 0, 0, 0.27)',
    '0 72px 80px -36px rgba(0, 0, 0, 0.28)',
    '0 76px 84px -38px rgba(0, 0, 0, 0.29)',
    '0 80px 88px -40px rgba(0, 0, 0, 0.30)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 6px 12px -3px rgba(0,0,0,0.1)'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.12)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #2196F3, #0B79D0)',
          '&:hover': {
            background: 'linear-gradient(to right, #0B79D0, #065699)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(to right, #673AB7, #5E35B1)',
          '&:hover': {
            background: 'linear-gradient(to right, #5E35B1, #4527A0)'
          }
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem'
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '1rem'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -2px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 16px -6px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px'
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600
        },
        subheader: {
          fontSize: '0.875rem',
          color: GREY[600]
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        elevation1: {
          boxShadow: '0 1px 4px -1px rgba(0,0,0,0.07)'
        },
        elevation2: {
          boxShadow: '0 4px 6px -2px rgba(0,0,0,0.08)'
        },
        elevation3: {
          boxShadow: '0 8px 12px -4px rgba(0,0,0,0.10)'
        },
        elevation4: {
          boxShadow: '0 12px 16px -6px rgba(0,0,0,0.12)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: GREY[300]
            },
            '&:hover fieldset': {
              borderColor: PRIMARY.light
            },
            '&.Mui-focused fieldset': {
              borderColor: PRIMARY.main
            },
            '&.Mui-error fieldset': {
              borderColor: ERROR.main
            }
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 8,
            marginTop: 4
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)',
          backgroundImage: 'none'
        },
        colorPrimary: {
          backgroundColor: '#FFFFFF',
          color: GREY[800]
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: `1px solid ${GREY[200]}`
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${GREY[200]}`,
          padding: '12px 16px'
        },
        head: {
          fontWeight: 600,
          backgroundColor: GREY[100]
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)'
        },
        standardSuccess: {
          backgroundColor: SUCCESS.lighter,
          color: SUCCESS.darker
        },
        standardInfo: {
          backgroundColor: INFO.lighter,
          color: INFO.darker
        },
        standardWarning: {
          backgroundColor: WARNING.lighter,
          color: WARNING.darker
        },
        standardError: {
          backgroundColor: ERROR.lighter,
          color: ERROR.darker
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem'
        },
        colorPrimary: {
          backgroundColor: PRIMARY.lighter,
          color: PRIMARY.darker
        },
        colorSecondary: {
          backgroundColor: SECONDARY.lighter,
          color: SECONDARY.darker
        },
        colorSuccess: {
          backgroundColor: SUCCESS.lighter,
          color: SUCCESS.darker
        },
        colorError: {
          backgroundColor: ERROR.lighter,
          color: ERROR.darker
        },
        colorWarning: {
          backgroundColor: WARNING.lighter,
          color: WARNING.darker
        },
        colorInfo: {
          backgroundColor: INFO.lighter,
          color: INFO.darker
        }
      }
    }
  }
});

// Dark theme settings
const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: PRIMARY,
    secondary: SECONDARY,
    success: SUCCESS,
    info: INFO,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: GREY[700],
    common: {
      black: '#000000',
      white: '#FFFFFF'
    },
    text: {
      primary: '#FFFFFF',
      secondary: GREY[400],
      disabled: GREY[600]
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: GREY[700]
    },
    action: {
      active: GREY[400],
      hover: GREY[700],
      selected: GREY[800],
      disabled: GREY[600],
      disabledBackground: GREY[700],
      focus: GREY[700],
      hoverOpacity: 0.08,
      disabledOpacity: 0.48
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: GREY[900],
          color: '#FFFFFF'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: GREY[800],
          borderRight: `1px solid ${GREY[700]}`
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${GREY[700]}`,
          padding: '12px 16px'
        },
        head: {
          fontWeight: 600,
          backgroundColor: GREY[900]
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: GREY[800]
        }
      }
    }
  },
  shadows: lightTheme.shadows
});

// Apply responsive font sizes
const themes = {
  light: responsiveFontSizes(lightTheme),
  dark: responsiveFontSizes(darkTheme)
};

export default themes;

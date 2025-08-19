import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green for Focus Time
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081', // Bright Pink for focus
      light: '#ff79b0',
      dark: '#c50055',
      contrastText: '#ffffff',
    },
    info: {
      main: '#00bcd4', // Bright Cyan for break
      light: '#54efff',
      dark: '#008ba3',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0d1137', // Dark blue from gradient start
      paper: '#1c235a', // For containers like timer, history - changed to gradientEnd
    },
    text: {
      primary: '#e8eaf6', // Main text color - Reverted to light
      secondary: '#c5cae9', // For secondary text - Reverted to light
      disabled: '#9fa8da', // For less prominent text - Reverted to light
    },
    // Custom colors based on the original CSS
    custom: {
      gradientStart: '#0d1137',
      gradientEnd: '#1c235a',
      tableHeaderBg: '#0d1137', // Darker shade for header
      tableRowEvenBg: '#151a40', // Slightly lighter dark shade for even rows
      dailyHistoryHeader: '#81d4fa',
    },
  },
  typography: {
    fontFamily: 'Quicksand, sans-serif',
    h1: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      color: '#c5cae9',
    },
    body1: {
      fontSize: '1.1em',
      lineHeight: 1.8,
      color: '#c5cae9',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #5c6bc0, #3f51b5)',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.2em',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          borderRadius: '20px',
        },
      },
    },
    MuiInputBase: { // For input fields and selects
      styleOverrides: {
        root: {
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          color: '#e8eaf6',
          fontSize: '1em',
          transition: 'border-color 0.3s ease, boxShadow 0.3s ease',
          '&:focus': {
            outline: 'none',
            borderColor: '#5c6bc0',
            boxShadow: '0 0 10px rgba(92, 107, 192, 0.5)',
          },
        },
      },
    },
  },
});

export default theme;
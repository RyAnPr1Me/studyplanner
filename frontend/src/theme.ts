import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#8ab4f8',
        dark: '#669df6',
        light: '#d2e3fc',
        contrastText: '#0b1f3a',
      },
      secondary: {
        main: '#81c995',
      },
      error: {
        main: '#f28b82',
      },
      warning: {
        main: '#fdd663',
      },
      background: {
        default: mode === 'dark' ? '#0f1115' : '#f8f9fa',
        paper: mode === 'dark' ? '#1a1c20' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#e8eaed' : '#202124',
        secondary: mode === 'dark' ? '#9aa0a6' : '#5f6368',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark'
              ? '0 2px 6px rgba(0,0,0,0.4)'
              : '0 1px 3px rgba(60,64,67,.3), 0 4px 8px rgba(60,64,67,.15)',
          },
        },
      },
    },
  })

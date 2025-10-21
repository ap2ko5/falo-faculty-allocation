import { createTheme } from '@mui/material/styles';

// College-style theme: deep navy primary, maroon secondary, warm gold accents
export const theme = createTheme({
  palette: {
    // Neutral, muted palette with a single reserved accent
    primary: {
      main: '#1f2937', // muted slate (primary UI color)
      light: '#374151',
      dark: '#0f1724',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6b7280', // neutral slate for secondary actions
      light: '#9ca3af',
      dark: '#4b5563',
      contrastText: '#ffffff',
    },
    info: {
      main: '#7a5a45', // subtle, desaturated accent (used sparingly)
      light: '#96745f',
      dark: '#563527',
      contrastText: '#ffffff',
    },
    success: {
      main: '#25603f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#b07a00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#9b2c2c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // very light neutral
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    h5: {
      fontSize: '1.05rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.95rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          padding: '7px 12px',
        },
        contained: {
          boxShadow: 'none',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(16,24,40,0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#ffffff',
          color: '#111827',
          borderBottom: '1px solid rgba(16,24,40,0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          borderRight: '1px solid rgba(16,24,40,0.04)',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(16,24,40,0.04)',
        },
        head: {
          fontWeight: 700,
          backgroundColor: 'rgba(16,24,40,0.02)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          padding: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        // standardWarning styles match the attached muted warning look
        standardWarning: {
          backgroundColor: 'rgb(247, 238, 238)', // muted warm background
          color: 'rgb(70, 34, 34)', // muted dark red text
          boxShadow: 'none',
        },
        message: {
          padding: '8px 0',
          minWidth: 0,
          overflow: 'auto',
        },
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
});
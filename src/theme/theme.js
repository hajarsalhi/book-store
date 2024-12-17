import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown - rich wooden library shelves
      light: '#A0522D', // Sienna - warmer brown
      dark: '#654321', // Dark Brown
    },
    secondary: {
      main: '#DEB887', // Burly Wood - vintage paper color
      light: '#F5DEB3', // Wheat - light parchment
      dark: '#D2691E', // Chocolate - deep accent
    },
    background: {
      default: '#FFF8DC', // Cornsilk - warm off-white background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810', // Dark Brown - main text
      secondary: '#5C4033', // Lighter Brown - secondary text
    },
    accent: {
      main: '#8B0000', // Dark Red - for accents and highlights
      light: '#CD5C5C', // Indian Red - lighter accent
    }
  },
  typography: {
    fontFamily: '"Libre Baskerville", "Merriweather", serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    }
  }
}); 
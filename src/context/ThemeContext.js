import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const lightTheme = {
  backgroundPrimary: '#ffffff',
  backgroundMuted: '#f5f5f5',
   textPrimary: '#000000',
   muted : '#ffffff',
   text : '#4A4A4A'
};

const darkTheme = {
  backgroundPrimary: '#121212',
  backgroundMuted: '#1e1e1e',
  textPrimary: '#ffffff',
  muted : '#4a4a4a',
  text: '#9EACC7',
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => setIsDark(prev => !prev);
  
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value=
    {{ 
      theme, 
      toggleTheme, 
      isDark 
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
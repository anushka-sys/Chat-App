import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const lightTheme = {
  backgroundPrimary: '#ffffff',
  backgroundMuted: '#f5f5f5',
  textPrimary: '#000000',
  textSecondary:'#787878',
  inputBackground: '#FFFFFF',
  inputBorder: '#C8C8C8',
};

const darkTheme = {
  backgroundPrimary: '#121212',
  backgroundMuted: '#1e1e1e',
  textPrimary: '#ffffff',
  textSecondary:'#cecece',
  inputBackground: '#1E1E1E',
  inputBorder: '#333333',

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
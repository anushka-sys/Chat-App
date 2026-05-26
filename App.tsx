import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import  ThemeProvider  from './src/context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
    <SafeAreaProvider>
      <KeyboardProvider>
        <AppNavigator />
      </KeyboardProvider>
    </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;

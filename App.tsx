import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigator from './src/navigation/AppNavigator'
import { KeyboardProvider } from 'react-native-keyboard-controller';

const App = () => {
  return (
    <SafeAreaProvider>
       <KeyboardProvider>
    <AppNavigator />
    </KeyboardProvider>
    </SafeAreaProvider>
  )
}

export default App
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigator from './src/navigation/AppNavigator'
import { KeyboardAvoidingView } from 'react-native'

const App = () => {
  return (
    <SafeAreaProvider>
    <AppNavigator />
    </SafeAreaProvider>
  )
}

export default App
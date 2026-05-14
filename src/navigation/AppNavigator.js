import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen'
import HomeScreen from '../screens/HomeScreen'
import Splash from '../screens/Splash'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Splash' component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Signup' component={SignupScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Home' component={HomeScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
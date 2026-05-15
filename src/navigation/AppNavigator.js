import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen'
import Splash from '../screens/Splash'
import TabNavigator from '../navigation/TabNavigator';
import ChatScreen from '../screens/ChatScreen'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Splash' component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Signup' component={SignupScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Main' component={TabNavigator} options={{headerShown:false}}/>
            <Stack.Screen name='Chat' component={ChatScreen} options={{title:"Messages"}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
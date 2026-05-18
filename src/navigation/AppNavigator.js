import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Splash from '../screens/Splash';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={Splash} />

        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Main" component={TabNavigator} />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: true,
            title: 'Messages',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

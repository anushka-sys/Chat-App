import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
        headerShown: false,

        // Active + Inactive Icon Colors
        tabBarActiveTintColor: '#d3d3d3',
        tabBarInactiveTintColor: '#d3d3d3',

        // Hide Labels
        tabBarShowLabel: false,

        // Tab Bar Styling
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,

          height: 70,

         // backgroundColor: '#111',

          // Rounded Top Corners
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,

          // Remove Default Border
          borderTopWidth: 0,

        },

        // Icon Styling
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return (
            <Icon
              name={iconName}
              size={26}
              color="#d3d3d3"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
       <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

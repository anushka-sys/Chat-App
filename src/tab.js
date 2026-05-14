
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

          backgroundColor: '#111',

          // Rounded Top Corners
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,

          // Remove Default Border
          borderTopWidth: 0,

          // Shadow (Android + iOS)
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
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
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

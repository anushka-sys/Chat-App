import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import React from 'react';

import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {

  // Logout function
  const handleLogout = async () => {

    try {

      await auth().signOut();

      Alert.alert('Success', 'Logged out successfully');

    } catch (error) {

      console.log('Logout Error:', error);

      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Profile Screen
      </Text>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  logoutButton: {
    backgroundColor: '#002DE3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
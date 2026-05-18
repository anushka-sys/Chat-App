import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  // Login function
  const loginUser = async () => {

    // Validation
    if (!email || !pass) {

      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {

      const auth = getAuth();
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );
      Alert.alert('Success', 'Login successful');
      navigation.replace('Main');
    } catch (error) {

      console.log('Login error:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Email or password is incorrect');
      } else {
        Alert.alert('Error', error.message);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.container}>

        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to continue chatting with your friends
        </Text>

        {/* Email Input */}
        <View style={styles.inputWrap}>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9EACC7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

        </View>

        {/* Password Input */}
        <View style={styles.inputWrap}>

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9EACC7"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={loginUser}
          disabled={loading}
        >

          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>

        </TouchableOpacity>

        {/* Signup Navigation */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >

          <Text style={styles.signupText}>
            Don't have an account? Sign up
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#002DE3',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
    paddingHorizontal: 16,
  },

  inputWrap: {
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#D0D5E8',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A1A',
  },

  buttoncontainer: {
    width: '90%',
    backgroundColor: '#002DE3',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  signupLink: {
    paddingTop: 18,
  },

  signupText: {
    color: '#4A4A4A',
    fontSize: 14,
  },

});
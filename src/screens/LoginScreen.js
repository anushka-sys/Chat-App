import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState,useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { ThemeContext } from '../context/ThemeContext';


import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { TYPOGRAPHY, RADIUS, fontWeight } from '../constants/typograph';

const LoginScreen = () => {
   const { isDark ,theme} = useContext(ThemeContext);
         const styles = getStyles(theme);
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
      await signInWithEmailAndPassword(auth, email.trim(), pass);
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
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Login to continue chatting with your friends
        </Text>

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

        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={loginUser}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const getStyles = theme =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: fontWeight.l,
    color: COLORS.primary,
    paddingBottom: SPACING.xs,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: TYPOGRAPHY.subtitle,
    color: theme.text,
    textAlign: 'center',
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.md,
  },

  inputWrap: {
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#D0D5E8',
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.md,
    backgroundColor: theme.backgroundMuted,
  },

  input: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.input,
    color: COLORS.input,
  },

  buttoncontainer: {
    width: '90%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.med,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.button,
    fontWeight: fontWeight.m,
  },

  signupLink: {
    paddingTop: 18,
  },

  signupText: {
    color: theme.text,
    fontSize: TYPOGRAPHY.subtitle,
  },
});

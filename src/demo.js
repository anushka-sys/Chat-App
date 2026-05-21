
// src/constants/colors.js

const COLORS = {
  primary: '#002DE3',
  white: '#FFFFFF',
  text: '#1A1A1A',
  secondaryText: '#4A4A4A',
  border: '#D0D5E8',
  placeholder: '#9EACC7',
};

export default COLORS;


// src/constants/spacing.js

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 48,
};

export default SPACING;


// src/constants/typography.js

const TYPOGRAPHY = {
  title: 26,
  subtitle: 14,
  input: 15,
  button: 16,
};

export default TYPOGRAPHY;



// src/constants/radius.js

const RADIUS = {
  sm: 8,
  lg: 30,
};

export default RADIUS;



import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from 'react-native';

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import TYPOGRAPHY from '../constants/typography';
import RADIUS from '../constants/radius';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    if (!name || !email || !pass || !confirmPass) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (pass !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (pass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await auth().createUserWithEmailAndPassword(
          email.trim(),
          pass,
        );

      const uid = userCredential.user.uid;

      await firestore().collection('users').doc(uid).set({
        uid,
        email: email.trim(),
        name: name.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await auth().signOut();

      Alert.alert('Success', 'Account created! Please login.');

      navigation.replace('Login');
    } catch (error) {
      console.log('Signup error:', error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address');
      } else {
        Alert.alert('Error', error.message);
      }
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Sign up to start chatting
        </Text>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.placeholder}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={COLORS.placeholder}
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={registerUser}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Creating Account...'
              : 'Sign up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: TYPOGRAPHY.subtitle,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },

  inputWrap: {
    width: '90%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },

  input: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.input,
    color: COLORS.text,
  },

  buttoncontainer: {
    width: '90%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.button,
    fontWeight: '600',
  },

  loginLink: {
    paddingTop: 18,
    paddingBottom: 28,
  },

  loginText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.subtitle,
  },
});

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import {TYPOGRAPHY,RADIUS} from '../constants/typograph';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    // Basic validation
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
      const userCredential = await auth().createUserWithEmailAndPassword( //create user acc
        email.trim(),
        pass,
      );

      const uid = userCredential.user.uid;

      await firestore().collection('users').doc(uid).set({ 
        uid: uid,
        email: email.trim(),
        name: name.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(), //uses firestore time
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
        <Text style={styles.subtitle}>Sign up to start chatting</Text>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            placeholderTextColor="#9EACC7"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9EACC7"
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
            placeholderTextColor="#9EACC7"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9EACC7"
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
            {loading ? 'Creating Account...' : 'Sign up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
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

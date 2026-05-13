import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const registerUser = () => {
    const userId = uuid.v4();
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        email: email,
        password: pass,
      })
      .then(() => {
        console.log('user created');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Create an account so you can explore all the existing jobs
        </Text>

        {/* Email */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9EACC7"
            value={email}
            onChangeText={txt => setEmail(txt)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9EACC7"
            value={pass}
            onChangeText={txt => setPass(txt)}
            secureTextEntry
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9EACC7"
            value={confirmPass}
            onChangeText={txt => setConfirmPass(txt)}
            secureTextEntry
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Already have an account</Text>
        </TouchableOpacity>

        {/* Or continue with */}
        <Text style={styles.orText}>Or continue with</Text>

        {/* Social Icons Row */}
        <View style={styles.socialRow}>
          {/* Google */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>f</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}></Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const BLUE = '#002DE3';

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

  // Header
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BLUE,
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

  // Inputs
  inputWrap: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: BLUE,
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

  // Button
  button: {
    width: '100%',
    backgroundColor: BLUE,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Already have account
  loginLink: {
    marginBottom: 28,
  },
  loginText: {
    color: '#4A4A4A',
    fontSize: 14,
  },

  // Or continue with
  orText: {
    color: BLUE,
    fontSize: 13,
    marginBottom: 18,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    gap: 20,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

import React, { useState, useEffect } from 'react';
import {
  Alert, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth'; // Firebase login/logout
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'; // Google popup login
import { WEB_CLIENT_ID } from '@env'; // your secret key from .env file
import { useNavigation } from '@react-navigation/native';
import Icone from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // ─── Runs once when screen loads ───────────────────────────
  useEffect(() => {

    // 1. Set up Google Sign-In with your Web Client ID
    async function setupGoogle() {
      const hasServices = await GoogleSignin.hasPlayServices();
      if (hasServices) {
        GoogleSignin.configure({
          offlineAccess: true,
          webClientId: WEB_CLIENT_ID, // from your .env file
        });
      }
    }
    setupGoogle();

    // 2. Watch for login/logout changes automatically
    // Firebase calls this function whenever the user logs in or out
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        // User is logged in → go to Home screen
        navigation.navigate('Home');
      }
    });

    // 3. Clean up the listener when this screen is closed
    return unsubscribe;

  }, []); // empty [] means run this only once on screen load

  // ─── Email + Password Login ────────────────────────────────
  const loginUser = () => {
    // Simple check: don't try to login if fields are empty
    if (!email || !pass) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    // Firebase checks the email + password for you (no manual Firestore needed!)
    auth()
      .signInWithEmailAndPassword(email.trim(), pass.trim())
      .then(() => {
        // onAuthStateChanged above will auto-navigate to Home
        console.log('Logged in!');
      })
      .catch(error => {
        // Show the right error message to the user
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No account found with this email.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Wrong password, please try again.');
        } else {
          Alert.alert('Error', 'Something went wrong, try again.');
          console.error(error);
        }
      });
  };

  // ─── Google Login ──────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      // Step 1: Open the Google account picker
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      // Step 2: Get the token Google gave us
      const idToken = result?.data?.idToken;

      // Step 3: Convert Google token → Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Step 4: Log into Firebase using that credential
      await auth().signInWithCredential(googleCredential);

      // onAuthStateChanged will auto-navigate to Home from here
      console.log('Signed in with Google!');

    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed, please try again.');
      console.log('Google error:', error);
    }
  };

  // ─── Logout ────────────────────────────────────────────────
  const logoutUser = async () => {
    try {
      await GoogleSignin.signOut(); // sign out from Google
      await auth().signOut(); // sign out from Firebase
      Alert.alert('Done', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', 'Logout failed.');
      console.log('Logout error:', error);
    }
  };

  // ─── UI ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to continue chatting with your friends and groups
        </Text>

        {/* Email input */}
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

        {/* Password input */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9EACC7"
            value={pass}
            onChangeText={txt => setPass(txt)}
            secureTextEntry // hides the password characters
          />
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={loginUser}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {/* Logout button — only shows when someone is logged in */}
        {auth().currentUser && (
          <TouchableOpacity
            style={[styles.buttoncontainer, styles.logoutBtn]}
            onPress={logoutUser}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        )}

        {/* Go to Signup */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        {/* Social login buttons row */}
        <View style={styles.socialRow}>

          {/* Official Google Sign-In button */}
          <GoogleSigninButton
            style={styles.googleBtn}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={loginWithGoogle}
          />

          <TouchableOpacity style={styles.socialBtn}>
            <Icone name="sc-facebook" size={35} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Icon name="mail" size={25} />
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

// ─── Styles (unchanged from your original) ─────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 48 },
  title: { fontSize: 26, fontWeight: '700', color: '#002DE3', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#4A4A4A', textAlign: 'center', lineHeight: 20, marginBottom: 36, paddingHorizontal: 16 },
  inputWrap: { width: '90%', borderWidth: 1.5, borderColor: '#D0D5E8', borderRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' },
  input: { paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: '#1A1A1A' },
  buttoncontainer: { width: '90%', backgroundColor: '#002DE3', borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  logoutBtn: { backgroundColor: '#E30000', marginTop: 12 }, // red for logout
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  signupLink: { paddingTop: 18, paddingBottom: 28 },
  signupText: { color: '#4A4A4A', fontSize: 14 },
  orText: { color: '#002DE3', fontSize: 13, marginBottom: 18 },
  socialRow: { flexDirection: 'row', gap: 20, alignItems: 'center' },
  googleBtn: { width: 60, height: 60 },
  socialBtn: { width: 60, height: 60, borderRadius: 10, borderWidth: 1, borderColor: '#D0D5E8', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
});



import {
  Alert, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Firebase Auth
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import Icone from 'react-native-vector-icons/EvilIcons';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // ─── Set up Google Sign-In once when screen loads ──────────
  useEffect(() => {
    async function setupGoogle() {
      const hasServices = await GoogleSignin.hasPlayServices();
      if (hasServices) {
        GoogleSignin.configure({
          offlineAccess: true,
          webClientId: WEB_CLIENT_ID,
        });
      }
    }
    setupGoogle();
  }, []);

  // ─── Email + Password Signup ───────────────────────────────
  const registerUser = () => {

    // Check nothing is empty
    if (!email || !pass || !confirmPass) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check passwords match before even calling Firebase
    if (pass !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Check password is at least 6 characters (Firebase requirement)
    if (pass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Firebase creates the account — no Firestore, no uuid needed!
    auth()
      .createUserWithEmailAndPassword(email.trim(), pass.trim())
      .then(() => {
        console.log('Account created!');
        Alert.alert('Success', 'Account created! Please log in.');
        navigation.navigate('Login'); // go to login after signup
      })
      .catch(error => {
        // Show helpful error messages
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'An account with this email already exists.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Please enter a valid email address.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Error', 'Password is too weak, use at least 6 characters.');
        } else {
          Alert.alert('Error', 'Something went wrong, please try again.');
          console.error(error);
        }
      });
  };

  // ─── Google Sign-Up (same flow as login — Firebase handles both) ──
  const signUpWithGoogle = async () => {
    try {
      // Step 1: Open Google account picker
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      // Step 2: Get the token Google returned
      const idToken = result?.data?.idToken;

      // Step 3: Convert it to a Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Step 4: Sign into Firebase — creates account if first time, logs in if returning
      await auth().signInWithCredential(googleCredential);

      console.log('Signed up with Google!');
      navigation.navigate('Home'); // go straight to app after Google signup

    } catch (error) {
      Alert.alert('Error', 'Google Sign-Up failed, please try again.');
      console.log('Google error:', error);
    }
  };

  // ─── UI ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Create an account so you can chat with your friends and groups
        </Text>

        {/* Email input */}
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

        {/* Password input */}
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

        {/* Confirm Password input */}
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

        {/* Sign Up button */}
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={registerUser}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        {/* Already have account link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        {/* Social buttons */}
        <View style={styles.socialRow}>

          {/* Official Google button */}
          <GoogleSigninButton
            style={styles.googleBtn}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={signUpWithGoogle}
          />

          <TouchableOpacity style={styles.socialBtn}>
            <Icone name="sc-facebook" size={35} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Icon name="mail" size={25} />
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

// ─── Styles (same as your original) ───────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 48 },
  title: { fontSize: 26, fontWeight: '700', color: '#002DE3', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#4A4A4A', textAlign: 'center', lineHeight: 20, marginBottom: 36, paddingHorizontal: 16 },
  inputWrap: { width: '90%', borderWidth: 1.5, borderColor: '#D0D5E8', borderRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' },
  input: { paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: '#1A1A1A' },
  buttoncontainer: { width: '90%', backgroundColor: '#002DE3', borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  loginLink: { paddingTop: 10, paddingBottom: 28 },
  loginText: { color: '#4A4A4A', fontSize: 14 },
  orText: { color: '#002DE3', fontSize: 13, marginBottom: 18 },
  socialRow: { flexDirection: 'row', gap: 20, alignItems: 'center' },
  googleBtn: { width: 60, height: 60 },
  socialBtn: { width: 60, height: 60, borderRadius: 10, borderWidth: 1, borderColor: '#D0D5E8', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
});

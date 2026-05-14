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
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import Icone from 'react-native-vector-icons/EvilIcons';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');

  const loginUser = () => {
    if (!email || !pass) {
      Alert.alert('Error', 'Please enter valid email and password');
      return;
    }

    firestore()
      .collection('users')
      .where('email', '==', email.trim())
      .get()
      .then(res => {
        if (res.docs.length > 0) {
          const user = res.docs[0].data();

          if (user.password === pass.trim()) {
            Alert.alert('Success', 'Login successful');
            console.log('logged in successful', user);
          } else {
            Alert.alert('Error', 'Invalid password');
          }
        } else {
          Alert.alert('Error', 'No user found with this email');
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Error', 'Something went wrong');
      });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Login to continue chatting with your friends and groups
        </Text>

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

        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={ () => {
            loginUser;
            navigation.navigate('Main')
          }}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
          
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Icon name="logo-google" size={25} />
          </TouchableOpacity>

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

  button: {
    backgroundColor: '#002DE3',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },

  signupLink: {
    paddingTop: 18,
    paddingBottom: 28,
  },

  signupText: {
    color: '#4A4A4A',
    fontSize: 14,
  },

  orText: {
    color: '#002DE3',
    fontSize: 13,
    marginBottom: 18,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 20,
  },

  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
});

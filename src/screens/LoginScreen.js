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

const LoginScreen = () => {
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');

  const loginUser = () => {
    if(!email || !pass)
    {
      Alert.alert('Error',"Please enter valid email and password");
      return;
    }
    firestore()
      .collection('users')
      .where('email', '==', email.trim())
      //.where('pass','==',pass)
      .get()
      .then(res => {
        
        if (res.docs.length > 0) {
          const user = res.docs[0].data();
          if(user.password == pass.trim())
          {
            Alert.alert('Success',"Login successful");
            console.log("logged in successful",user)
          } else{
            Alert.alert('error','invalid password')
          }
        } else {
          Alert.alert('no user found with this email');
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert('something went wrong');
      });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Login here</Text>

        <View style={styles.input}>
          <TextInput
            style={styles.email}
            placeholder="Enter your mail"
            placeholderTextColor="grey"
            value={email}
            onChangeText={txt => setEmail(txt)}
          />
        </View>

        <View style={styles.inputwarap}>
          <TextInput
            style={styles.email}
            placeholder="Enter password"
            placeholderTextColor="grey"
            value={pass}
            onChangeText={txt => setPass(txt)}
          />
        </View>

        <View style={styles.buttonwraper}>
          <TouchableOpacity style={styles.button} onPress={() => loginUser()}>
            <Text style={styles.btntext}>Log in</Text>
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 50,
  },
  email: {
    paddingVertical: 15,
    paddingLeft: 15,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 50,
  },
  inputwarap: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 30,
  },
  buttonwraper: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#002DE3',
    borderRadius: 30,
    marginTop: 50,
    backgroundColor: '#002DE3',
  },
  button: {
    paddingVertical: 12,
    paddingLeft: 115,
  },
  btntext: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
});

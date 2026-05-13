import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from '../components/Loader'

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
   
    const registerUser = () =>{
      const userId=uuid.v4();
      firestore().collection("users").doc(userId).set({
        email:email,
        password:pass,
      }).then(res=>{
        console.log('user created');
        navigation.navigate('Login')
      }).catch(error => {
        console.log(error);
      })
    }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Create an account</Text>

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
          <TouchableOpacity 
          onPress={()=>{registerUser()}}
          style={styles.button}>
            <Text style={styles.btntext}>Sign up</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
        style={styles.login}
        onPress={()=>navigation.navigate('Login')}
        >
          <Text style={styles.logintxt}>or Log in </Text>
          {/* <Loader /> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
  login:{
    paddingTop:20,
  },
  logintxt:{
    textDecorationLine:'underline'
  },
});

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const LoginScreen = () => {
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Login here</Text>

        <View style={styles.input}>
          <TextInput
            style={styles.email}
            placeholder="Enter mail"
            value={email}
            onChangeText={txt => setEmail(txt)}
          />
        </View>

        <View style={styles.inputwarap}>
          <TextInput
            style={styles.email}
            placeholder="Enter password"
            value={pass}
            onChangeText={txt => setPass(txt)}
          />
        </View>

        <View style={styles.buttonwraper}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.btntext}>Sign in</Text>
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

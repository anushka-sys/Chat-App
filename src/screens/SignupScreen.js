import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
      <Text style={styles.header}>SignupScreen</Text>
      
      <View style={styles.input}>
        <TextInput style={styles.email}
         placeholder='Enter mail' />
      </View>

      <View style={styles.inputwarap}>
        <TextInput style={styles.email}
        placeholder='Enter password'
        />
      </View>

      <View style={styles.buttonwraper}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.btntext}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
  safe:{
    flex:1,
  },
  container:{
    flex:1,
    alignItems:'center',
  },
  header:{
    fontSize:20,
    fontWeight:'500',
    paddingTop:50,
  },
  email:{
   paddingVertical:15,
   paddingLeft:15,
  },
  input:{
     width:'80%',
     borderWidth:1,
    borderColor:'black',
    borderRadius:5,
    marginTop:50,
  },
  inputwarap:{
    width:'80%',
     borderWidth:1,
    borderColor:'black',
    borderRadius:5,
    marginTop:30,
  },
  buttonwraper:{
    // width:'80%',
    //  borderWidth:1,
    // borderColor:'#002DE3',
    // borderRadius:30,
    // marginTop:50,
    // backgroundColor:'#002DE3',
  },
  button:{
    paddingVertical:12,
  // paddingLeft:95,
   width:'80%',
     borderWidth:1,
    borderColor:'#002DE3',
    borderRadius:30,
    marginTop:50,
    backgroundColor:'#002DE3',
  },
  btntext:{
    color:'white',
    fontSize:15,
    fontWeight:'500',
  }
})
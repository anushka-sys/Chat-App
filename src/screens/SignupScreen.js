import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
      <Text style={styles.header}>SignupScreen</Text>
      
      <View style={styles.input}>
        <TextInput style={styles.email}
         placeholder='Enter mail'>
          
        </TextInput>
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
    borderWidth:1,
    borderColor:'black',
   
  },
  input:{
     paddingVertical:12,
    paddingHorizontal:20,
  },
})
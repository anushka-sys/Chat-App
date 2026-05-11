import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {
  return (
    <SafeAreaView style={{flex:1}} >
      <View style={styles.container}>
      <Image 
      style={styles.image}
      source = {require('../assets/Illustration.png')}
      />
    </View>
    <View style={styles.text}>
      <Text style={styles.title}>
        Connect easily with{'\n'} your family and friends {'\n'}over countries
      </Text>

      <View style={styles.button}>
        <TouchableOpacity style={styles.btncontainer}>
      <Text style={styles.buttontxt}>
        Start Messaging
      </Text>
    </TouchableOpacity>
      </View>
    </View>
   <View>
     
   </View>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    //justifyContent:'center',
   paddingTop:102,
  },
  image:{
    height:200,
    width:190,
  },
  text:{
    paddingBottom:150,
    justifyContent:'center',
    alignItems:'center',
  },
  title:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'500',
    color:'#0F1828'
  },
  btncontainer:{
    borderWidth:1,
    borderRadius:30,
    borderColor:'#002DE3',
    backgroundColor:'#002DE3',
    
  },
  buttontxt:{
    paddingHorizontal:101,
    paddingVertical:12,
    fontSize:16,
    fontWeight:'500',
    color:'white'
  },
  button:{
    paddingTop:50,
  }
})
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {
  return (
   <SafeAreaView style={styles.safe}>
  <View style={styles.topSection}>
    <Image
      style={styles.image}
      source={require('../assets/Illustration.png')}
    />
  </View>

  <View style={styles.bottomSection}>
    <Text style={styles.title}>
      Connect easily with{'\n'} your family and friends {'\n'}over countries
    </Text>

    <View style={styles.button}>
      <TouchableOpacity style={styles.btncontainer}>
      <Text style={styles.buttontxt}>Start Messaging</Text>
    </TouchableOpacity>
    </View>
  </View>
</SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({
safe:{
  flex:1,
  backgroundColor:'#fff'
},

topSection:{
  flex:3,
  justifyContent:'center',
  alignItems:'center'
},

bottomSection:{
  flex:2,
  justifyContent:'space-evenly',
  alignItems:'center',
  paddingHorizontal:24,
  paddingBottom:30
},

image:{
  height:220,
  width:220,
  resizeMode:'contain'
},

title:{
  textAlign:'center',
  fontSize:22,
  fontWeight:'500',
  color:'#0F1828'
},

btncontainer:{
  width:'100%',
  borderRadius:30,
  backgroundColor:'#002DE3',
  paddingVertical:12,
  alignItems:'center'
},

buttontxt:{
  fontSize:16,
  fontWeight:'600',
  color:'white'
},
button:{
   width:'100%',
   paddingBottom:-30,
}

})
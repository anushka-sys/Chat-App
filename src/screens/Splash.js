import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 31428f90c384ab99d2842ac0d56f524e8077a63a
  )
}

export default Splash

const styles = StyleSheet.create({
<<<<<<< HEAD
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

=======
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
>>>>>>> 31428f90c384ab99d2842ac0d56f524e8077a63a
})
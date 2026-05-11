import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {
  return (
    <SafeAreaView style={{flex:1}} >
      <View style={styles.container}>
      <Text>Splash</Text>
      <Image 
      style={styles.image}
      source = {require('../assets/Illustration.png')}
      />
    </View>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  image:{
    height:100,
    width:100,
  }
})
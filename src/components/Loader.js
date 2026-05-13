import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View>
      <ActivityIndicator size={'large'}/>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})
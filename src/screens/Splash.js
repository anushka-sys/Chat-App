import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topSection}>
        <Image
          style={styles.image}
          source={require('../assets/Illustration.png')}
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>
            Connect easily with{'\n'} your family and friends {'\n'}over
            countries
          </Text>
        </View>

        <View style={styles.termscon}>
          <Text style={styles.terms}>Terms & Privacy Policy</Text>
        </View>

        <View style={styles.btn}>
          <TouchableOpacity
            style={styles.btncontainer}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.buttontxt}>Start Messaging</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topSection: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },

  image: {
    width: '80%',
    height: height * 0.38, 
    resizeMode: 'contain',
    flexShrink: 1, 
  },

  bottomSection: {
    flex: 1, 
    paddingHorizontal: 24,
    justifyContent: 'space-between', 
    paddingTop: 16,
    paddingBottom: 40, 
  },

  textBlock: {
    width: '100%',
    alignItems: 'center',
   
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    color: '#0F1828',
  },

  terms: {
    fontSize: 12,
    fontWeight: '500',
    color: '#162030',
    textAlign: 'center',
  },

  btncontainer: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#002DE3',
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttontxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },

  termscon: {
    alignItems: 'center',
  },

  btn: {
    
  },
});

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },

  image: {
    // height:620,
    width: '80%',
    resizeMode: 'contain',
    paddingTop: 20,
    //aspectRatio:1,
  },

  bottomSection: {
    flex: 2,
    paddingHorizontal: 24,
    // paddingBottom:100,
    justifyContent: 'flex-end',
  },

  textBlock: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 100,
  },

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    color: '#0F1828',
    paddingBottom: 20,
  },

  terms: {
    fontSize: 12,
    fontWeight: '500',
    color: '#162030',
    paddingBottom: 30,
  },

  btncontainer: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#002DE3',
    paddingVertical: 14,
    // paddingHorizontal:80,
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
    paddingBottom: 60,
  },
});

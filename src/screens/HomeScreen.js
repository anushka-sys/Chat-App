import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/user-1.jpg'),
    messageTime: '4 mins ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/user-2.jpg'),
    messageTime: '2 hours ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/user-4.jpg'),
    messageTime: '1 hour ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/user-3.jpg'),
    messageTime: '1 day ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const HomeScreen = () => {
const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={()=> navigation.navigate('Chat')}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <View style={styles.userImgWrapper}>
          <Image source={item.userImg} style={styles.userImg} />
        </View>

        <View style={styles.textSection}>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.postTime}>{item.messageTime}</Text>
          </View>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.messageText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImgWrapper: {
    marginRight: 12,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;

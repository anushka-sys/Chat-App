import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SearchBar from '../components/SearchBar'


const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setsearchQuery] = useState('')
  const currentUid = auth().currentUser?.uid; //current user logged in


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users') //get users
      .onSnapshot(snapshot => {
        const allUsers = snapshot.docs //convert firestore docs to js arrays
          .map(doc => doc.data())
          .filter(u => u.uid !== currentUid); //remove current user
        setUsers(allUsers);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate('Chat', {
          receiverUid: item.uid,
          receiverName: item.name,
          receiverImage: item.image,
        });
      }}
    >
      <View style={styles.userInfo}>
        <View style={styles.userImgWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.textSection}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.messageText}>Tap to chat</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#002DE3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setsearchQuery}/>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
            No other users found. Ask a friend to sign up!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#e5e5e5',
    paddingTop: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImgWrapper: {
    paddingRight: 12,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#002DE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  textSection: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default HomeScreen;

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setsearchQuery] = useState('');
  const currentUid = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')            //fetch users
      .limit(30) 
      .onSnapshot(snapshot => {   ///creates realtimelistner
        const allUsers = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),             //spreads all firestore fields into onj
          }))
          .filter(user => user.uid !== currentUid); //filter current user

        setUsers(allUsers);
        setLoading(false);
      });

    return () => unsubscribe(); //stop listner
  }, [currentUid]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() =>
        navigation.navigate('Chat', {
          receiverUid: item.uid,
          receiverName: item.name,
          receiverImage: item.image,
        })
      }
    >
      
      <View style={styles.avatarWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

   
      <View style={styles.textWrapper}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.subtitle}>Tap to chat</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#002DE3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

   
      <SearchBar value={searchQuery} onChangeText={setsearchQuery} />

     
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>No other users found</Text>
        }
      />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* HEADER */

  header: {
    paddingHorizontal: 20,
    // marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: '500',
    color: '#000',
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },

  /* USER ROW */

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatarImg: {
    width: 58,
    height: 58,
    borderRadius: 16,
  },

  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#002DE3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },

  textWrapper: {
    marginLeft: 14,
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#8E8E93',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

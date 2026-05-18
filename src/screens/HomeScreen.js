import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth().currentUser?.uid;

  useEffect(() => {
    // Load all users EXCEPT yourself
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const allUsers = snapshot.docs
          .map(doc => doc.data())
          .filter(u => u.uid !== currentUid); // hide yourself
        setUsers(allUsers);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Chat', { userId: item.uid })}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <View style={styles.userImgWrapper}>
          {/* Placeholder avatar using first letter of email */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.textSection}>
          <Text style={styles.userName}>{item.email}</Text>
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
            No other users found. Ask a friend to sign up!
          </Text>
        }
      />
    </SafeAreaView>
  );
};

// Keep your existing styles, add these new ones:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e5e5' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userImgWrapper: { marginRight: 12 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#002DE3', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  textSection: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  messageText: { fontSize: 14, color: '#666', marginTop: 2 },
});

export default HomeScreen;
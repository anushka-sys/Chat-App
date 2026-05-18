import React, { useEffect, useState, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  // Pass receiverUid + receiverName when navigating to this screen
  const { receiverUid, receiverName } = route.params;

  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');

  const currentUser = auth().currentUser;

  // Create a stable, shared conversation ID for these two users
  const conversationId = [currentUser.uid, receiverUid].sort().join('_');

  // Fetch the current user's name from Firestore
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setSenderName(doc.data().name || currentUser.email);
        } else {
          setSenderName(currentUser.email);
        }
      })
      .catch(() => setSenderName(currentUser.email));
  }, []);

  // Listen only to THIS private conversation
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conversations') // New top-level collection
      .doc(conversationId)
      .collection('messages') // Sub-collection of messages
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt?.toDate(),
          };
        });
        setMessages(msgs);
      });

    return unsubscribe;
  }, [conversationId]);

  const onSend = useCallback(
    async (messageArray = []) => {
      const msg = messageArray[0];
      const myMsg = {
        _id: msg._id,
        text: msg.text || '',
        createdAt: new Date(),
        sentBy: currentUser.uid,
        sentTo: receiverUid,
        user: {
          _id: currentUser.uid,
          name: senderName || currentUser.email || 'User', // Show name, fallback to email
        },
      };

      setMessages(prev => GiftedChat.append(prev, [myMsg]));

      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(myMsg);
    },
    [conversationId, senderName],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={{
          _id: currentUser.uid,
          name: senderName,
        }}
        messagesContainerStyle={{ backgroundColor: '#fff' }}
        placeholder="Type a message..."
        scrollToBottom
        showUserAvatar={false}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

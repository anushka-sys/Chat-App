import React, { useEffect, useState, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  const { receiverUid, receiverName } = route.params;

  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');

  const currentUser = auth().currentUser;

  const conversationId = [currentUser.uid, receiverUid].sort().join('_');

  
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

  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conversations') 
      .doc(conversationId)
      .collection('messages') 
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

    if (!msg) return; // guard

    const myMsg = {
      _id: msg._id ? String(msg._id) : firestore().collection('_').doc().id, // generate ID if missing
      text: msg.text ? String(msg.text) : '',
      createdAt: firestore.FieldValue.serverTimestamp(), // use Firestore timestamp, not JS Date
      sentBy: currentUser.uid ? currentUser.uid : '',
      sentTo: receiverUid ? receiverUid : '',
      user: {
        _id: currentUser.uid ? currentUser.uid : '',
        name: senderName ? senderName : (currentUser.email ? currentUser.email : 'User'),
      },
    };

    const localMsg = { ...myMsg, createdAt: new Date() };
    setMessages(prev => GiftedChat.append(prev, [localMsg]));

    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(myMsg);
    } catch (e) {
      console.log('Firestore send error:', e);
    }
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

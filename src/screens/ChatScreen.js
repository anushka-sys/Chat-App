import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/elements'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  const { receiverUid } = route.params;
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const headerHeight = useHeaderHeight(); 

  const currentUser = auth().currentUser; // current logged in user
  const conversationId = [currentUser.uid, receiverUid].sort().join('_');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(doc => {
        setSenderName(
          doc.exists ? doc.data().name || currentUser.email : currentUser.email,
        );
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
          return { ...data, createdAt: data.createdAt?.toDate() };
        });
        setMessages(msgs);
      });
    return unsubscribe;
  }, [conversationId]);

  const onSend = useCallback(
    async (messageArray = []) => {
      const msg = messageArray[0];
      if (!msg) return;

      const myMsg = {
        _id: msg._id ? String(msg._id) : firestore().collection('_').doc().id,
        text: msg.text ? String(msg.text) : '',
        createdAt: firestore.FieldValue.serverTimestamp(),
        sentBy: currentUser.uid || '',
        sentTo: receiverUid || '',
        user: {
          _id: currentUser.uid || '',
          name: senderName || currentUser.email || 'User',
        },
      };

      setMessages(prev =>
        GiftedChat.append(prev, [{ ...myMsg, createdAt: new Date() }]),
      );

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // ← 'height' for Android
      keyboardVerticalOffset={headerHeight} // ← precise offset
    >
      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={{ _id: currentUser.uid, name: senderName }}
        placeholder="Type a message..."
        scrollToBottom
        showUserAvatar={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={Platform.OS === 'ios' ? headerHeight : 0}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#002DE3', padding: 2 },
              left: { backgroundColor: '#E9E9EB', padding: 2 },
            }}
            textStyle={{
              right: { color: '#fff' },
              left: { color: '#000' },
            }}
          />
        )}
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

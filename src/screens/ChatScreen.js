import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  const { receiverUid } = route.params;
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const headerHeight = useHeaderHeight(); 

  const currentUser = auth().currentUser; // current logged in user
  const conversationId = [currentUser.uid, receiverUid].sort().join('_'); //create chatroom id

  useEffect(() => {
    firestore()
      .collection('users')   //extract user name from the doc
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

  const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#7a7a7a',
      paddingTop: 6,
      paddingBottom: 6,
      paddingHorizontal: 8,
      borderTopWidth: 0,
      elevation: 10, // android shadow
      shadowColor: '#000', // ios shadow
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    }}
    primaryStyle={{
      alignItems: 'center',
    }}
  />
);

const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      backgroundColor: '#595f69',
      borderRadius: 25,
      paddingHorizontal: 16,
      marginLeft: 8,
      marginRight: 8,
      fontSize: 16,
      lineHeight: 20,
      maxHeight: 120,
      minHeight: 44,
    }}
    placeholderTextColor="#888"
  />
);

const renderSend = props => (
  <Send {...props}>
    <View
      style={{
        backgroundColor: '#002DE3',
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        marginBottom: 4,
      }}
    >
      <Icon name="send" size={18} color="#fff" />
    </View>
  </Send>
);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={headerHeight} 
    >
      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={{ _id: currentUser.uid, name: senderName }}
        placeholder="Type a message..."
        scrollToBottom
        showUserAvatar={false}
        renderInputToolbar={renderInputToolbar}
renderComposer={renderComposer}
renderSend={renderSend}
alwaysShowSend
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

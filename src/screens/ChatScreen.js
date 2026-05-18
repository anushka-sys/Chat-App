import React, { useEffect, useState, useCallback } from 'react';

import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = () => {

  const [messages, setMessages] = useState([]);

  // Realtime messages listener
  useEffect(() => {

    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {

        const allMessages = querySnapshot.docs.map(doc => {

          const data = doc.data();

          return {
            ...data,
            createdAt: data.createdAt?.toDate(),
          };
        });

        setMessages(allMessages);
      });

    return unsubscribe;

  }, []);

  // Send message
  const onSend = useCallback(async (messageArray = []) => {

    const msg = messageArray[0];

    const myMsg = {
      ...msg,

      sentBy: auth().currentUser?.email,

      sentTo: 'everyone',

      createdAt: new Date(),
    };

    // Optimistic UI update
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [myMsg]),
    );

    // Save in Firestore
    await firestore()
      .collection('chats')
      .add(myMsg);

  }, []);

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >

      <GiftedChat
        messages={messages}

        onSend={messages => onSend(messages)}

        user={{
          _id: auth().currentUser?.email,
        }}

        // Remove extra top spacing
        messagesContainerStyle={{
          backgroundColor: '#fff',
          paddingTop: 0,
          marginTop: 0,
        }}

        // Better keyboard handling
        bottomOffset={Platform.OS === 'android' ? 5 : 0}

        // Remove avatar duplicates
        showUserAvatar={false}

        // Smooth scrolling
        scrollToBottom

        // Placeholder
        placeholder="Type a message..."

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
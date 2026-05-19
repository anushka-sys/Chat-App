import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  const { receiverUid } = route.params;
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const [inputText, setInputText] = useState('');

  const headerHeight = useHeaderHeight();
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

  function formatTime(date) {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async function onSend() {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');

    const newMessage = {
      _id: firestore().collection('_').doc().id,
      text: text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sentBy: currentUser.uid,
      sentTo: receiverUid,
      user: {
        _id: currentUser.uid,
        name: senderName || currentUser.email,
      },
    };

    setMessages(prev => [{ ...newMessage, createdAt: new Date() }, ...prev]);

    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(newMessage);
    } catch (e) {
      console.log('Send error:', e);
    }
  }

  function renderMessage({ item }) {
    const isMe = item.user?._id === currentUser.uid;

    return (
      <View style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
          <Text style={[styles.messageText, isMe ? styles.textRight : styles.textLeft]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#494949"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageRow: {
    marginVertical: 3,
    flexDirection: 'row',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  bubbleRight: {
    backgroundColor: '#002DE3',
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    backgroundColor: '#E9E9EB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textRight: {
    color: '#fff',
  },
  textLeft: {
    color: '#000',
  },
  timeText: {
    fontSize: 11,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timeRight: {
    color: 'rgba(255,255,255,0.65)',
  },
  timeLeft: {
    color: '#999',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#e7e7e7',
    borderRadius: 25,
    paddingHorizontal: 19,
    paddingVertical:10,
    fontSize: 16,
    color: '#fff',
    maxHeight: 120,
    marginRight: 8,
   // paddingBottom:5,
  },
  sendButton: {
    backgroundColor: '#002DE3',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
});

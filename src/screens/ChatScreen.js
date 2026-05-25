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
import LinkPreviewCard from '../components/LinkPreviewCard';

import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { TYPOGRAPHY, RADIUS, fontWeight } from '../constants/typograph';

const ChatScreen = ({ route }) => {
  const { receiverUid } = route.params;
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const [inputText, setInputText] = useState('');

  const [previewUrl, setPreviewUrl] = useState('');

  const headerHeight = useHeaderHeight();
  const currentUser = auth().currentUser;
  const conversationId = [currentUser.uid, receiverUid].sort().join('_'); //creates a unique chat roomid

  function extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  }

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // console.log('user doc',doc.data());
          //console.log('all fields', JSON.stringify(doc.data()));

          setSenderName(doc.data().name || currentUser.email);
          // console.log('current user uid', currentUser.uid);
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
      .orderBy('createdAt', 'desc') //newest msg first
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => {
          //converts firestore doc into normal js obj
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
    if (!text) return; //check if empty
    setInputText('');
    setPreviewUrl('');

    const newMessage = {
      //message object
      _id: firestore().collection('_').doc().id,
      text: text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sentBy: currentUser.uid,
      sentTo: receiverUid,
      user: {
        _id: currentUser.uid,
        name:
          senderName || currentUser.displayName || currentUser.email || 'User',
      },
    };
    setMessages(prev => [{ ...newMessage, createdAt: new Date() }, ...prev]);
    try {
      await firestore() //save to firestore
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(newMessage);
    } catch (e) {
      console.log('Send error:', e);
    }
  }

  function renderMessage({ item }) {
    // console.log(item)
    const isMe = item.user?._id === currentUser.uid;

    const urlInMessage = extractUrl(item.text);

    return (
      <View
        style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]} //my msg(sender) right side other msg left side
      >
        <View
          style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}
        >
          {/* {!isMe && (
            <Text style={styles.senderName}>
              {item.user?.name || 'Unknown User'}
            </Text>
          )} */}
          <Text
            style={[
              styles.senderName,
              isMe ? styles.senderNameRight : styles.senderNameLeft,
            ]}
          >
            {isMe ? 'You' : item.user?.name || 'Unknown User'}
          </Text>
          <Text
            style={[
              styles.messageText,
              isMe ? styles.textRight : styles.textLeft,
            ]}
          >
            {item.text}
          </Text>

          {urlInMessage && <LinkPreviewCard url={urlInMessage} />}

          <Text
            style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}
          >
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
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet</Text>
        }
      />

      {previewUrl ? (
        <View style={inputPreviewStyles.wrapper}>
          <LinkPreviewCard url={previewUrl} />
          {/* ✅ X button clears the previewUrl state and hides the banner */}
          <TouchableOpacity
            style={inputPreviewStyles.closeButton}
            onPress={() => setPreviewUrl('')}
          >
            <Icon name="close-circle" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={text => {
            setInputText(text);
            // ✅ Detect URL on every keystroke and update previewUrl state
            const url = extractUrl(text);
            setPreviewUrl(url || '');
          }}
          placeholder="Type a message..."
          placeholderTextColor="#494949"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
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

const inputPreviewStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginBottom: 6,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.exsmall,
    paddingVertical: SPACING.xsmall,
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
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.exsmall,
    paddingTop: SPACING.xsmall,
    paddingBottom: SPACING.x,
  },
  bubbleRight: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.x,
  },
  bubbleLeft: {
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: SPACING.x,
  },
  messageText: {
    fontSize: TYPOGRAPHY.button,
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
    paddingVertical: 10,
    fontSize: 16,
    color: '#040404',
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
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
  senderNameRight: {
    color: '#ffffff',
  },
});

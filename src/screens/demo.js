
import React, { useEffect, useState, useContext } from 'react';
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
import { ThemeContext } from '../context/ThemeContext';

import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { TYPOGRAPHY, RADIUS } from '../constants/typograph';

const ChatScreen = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { receiverUid } = route.params;

  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const [inputText, setInputText] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  const headerHeight = useHeaderHeight();
  const currentUser = auth().currentUser;

  const conversationId = [currentUser.uid, receiverUid]
    .sort()
    .join('_');

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
      .onSnapshot(async snapshot => {
        const msgs = snapshot.docs.map(doc => {
          const data = doc.data();

          return {
            ...data,
            createdAt: data.createdAt?.toDate(),
          };
        });

        setMessages(msgs);

        // Mark messages as delivered
        snapshot.docs.forEach(async doc => {
          const data = doc.data();

          if (
            data.sentTo === currentUser.uid &&
            data.status === 'sent'
          ) {
            await doc.ref.update({
              status: 'delivered',
            });
          }
        });
      });

    return unsubscribe;
  }, [conversationId]);

  // Typing indicator listener
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .onSnapshot(doc => {
        const data = doc.data();

        if (!data?.typing) return;

        const receiverTyping = data.typing[currentUser.uid];

        if (receiverTyping?.isTyping) {
          setIsTyping(true);
          setTypingUser(receiverTyping.name || 'Someone');
        } else {
          setIsTyping(false);
          setTypingUser('');
        }
      });

    return unsubscribe;
  }, [conversationId]);

  // Reset unread count
  useEffect(() => {
    if (!currentUser?.uid) return;

    firestore()
      .collection('conversations')
      .doc(conversationId)
      .set(
        {
          unreadCounts: {
            [currentUser.uid]: 0,
          },
        },
        { merge: true },
      )
      .catch(() => {});
  }, [conversationId, currentUser?.uid]);

  // Mark messages as read
  useEffect(() => {
    if (!currentUser?.uid) return;

    const markMessagesAsRead = async () => {
      const snapshot = await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .where('sentTo', '==', currentUser.uid)
        .where('status', 'in', ['sent', 'delivered'])
        .get();

      const batch = firestore().batch();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'read',
        });
      });

      await batch.commit();
    };

    markMessagesAsRead();
  }, [conversationId]);

  function formatTime(date) {
    if (!date) return '';

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function handleTyping(text) {
    setInputText(text);

    const url = extractUrl(text);
    setPreviewUrl(url || '');

    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .set(
          {
            typing: {
              [receiverUid]: {
                isTyping: text.length > 0,
                name: senderName,
              },
            },
          },
          { merge: true },
        );
    } catch (e) {
      console.log('Typing error:', e);
    }
  }

  async function onSend() {
    const text = inputText.trim();

    if (!text) return;

    setInputText('');
    setPreviewUrl('');

    const newMessage = {
      _id: firestore().collection('_').doc().id,
      text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sentBy: currentUser.uid,
      sentTo: receiverUid,
      status: 'sent',
      user: {
        _id: currentUser.uid,
        name:
          senderName ||
          currentUser.displayName ||
          currentUser.email ||
          'User',
      },
    };

    setMessages(prev => [
      {
        ...newMessage,
        createdAt: new Date(),
      },
      ...prev,
    ]);

    try {
      const batch = firestore().batch();

      const msgRef = firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .doc(newMessage._id);

      batch.set(msgRef, newMessage);

      const convRef = firestore()
        .collection('conversations')
        .doc(conversationId);

      batch.set(
        convRef,
        {
          members: [currentUser.uid, receiverUid],
          lastMessageText: text,
          lastMessageAt: firestore.FieldValue.serverTimestamp(),
          [`unreadCounts.${receiverUid}`]: firestore.FieldValue.increment(1),
          [`unreadCounts.${currentUser.uid}`]: 0,
        },
        { merge: true },
      );

      await batch.commit();

      // Reset typing
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .set(
          {
            typing: {
              [receiverUid]: {
                isTyping: false,
                name: senderName,
              },
            },
          },
          { merge: true },
        );
    } catch (e) {
      console.log('Send error:', e);
    }
  }

  function renderMessage({ item }) {
    const isMe = item.user?._id === currentUser.uid;

    const urlInMessage = extractUrl(item.text);

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.rowRight : styles.rowLeft,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          <Text
            style={[
              styles.senderName,
              isMe
                ? styles.senderNameRight
                : styles.senderNameLeft,
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

          {urlInMessage && (
            <LinkPreviewCard url={urlInMessage} />
          )}

          <Text
            style={[
              styles.timeText,
              isMe ? styles.timeRight : styles.timeLeft,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>

          {isMe && (
            <Text style={styles.messageStatus}>
              {item.status === 'sent' && '✓ Sent'}
              {item.status === 'delivered' && '✓✓ Delivered'}
              {item.status === 'read' && '✓✓ Read'}
            </Text>
          )}
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
      {isTyping && (
        <Text style={styles.typingText}>
          {typingUser} is typing...
        </Text>
      )}

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
          <Text style={styles.emptyText}>
            No messages yet
          </Text>
        }
      />

      {previewUrl ? (
        <View style={inputPreviewStyles.wrapper}>
          <LinkPreviewCard url={previewUrl} />

          <TouchableOpacity
            style={inputPreviewStyles.closeButton}
            onPress={() => setPreviewUrl('')}
          >
            <Icon
              name="close-circle"
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          placeholderTextColor="#494949"
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() &&
              styles.sendButtonDisabled,
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

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
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
      backgroundColor: theme.backgroundPrimary,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    textInput: {
      flex: 1,
      backgroundColor: theme.backgroundMuted,
      borderRadius: 25,
      paddingHorizontal: 19,
      paddingVertical: 10,
      fontSize: 16,
      color: '#040404',
      maxHeight: 120,
      marginRight: 8,
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
      marginBottom: 3,
    },
    senderNameRight: {
      color: '#ffffff',
    },
    senderNameLeft: {
      color: '#555',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#999',
    },
    typingText: {
      marginLeft: 12,
      marginTop: 10,
      fontSize: 13,
      color: '#777',
      fontStyle: 'italic',
    },
    messageStatus: {
      fontSize: 10,
      marginTop: 4,
      alignSelf: 'flex-end',
      color: '#ffffff',
      opacity: 0.8,
    },
  });



import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react';
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
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setsearchQuery] = useState('');
  const [convMeta, setConvMeta] = useState({});

  const currentUid = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .limit(30)
      .onSnapshot(snapshot => {
        const allUsers = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(user => user.uid !== currentUid);

        setUsers(allUsers);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [currentUid]);

  // Realtime conversation metadata
  useEffect(() => {
    if (!currentUid) return;

    const unsubscribe = firestore()
      .collection('conversations')
      .where('members', 'array-contains', currentUid)
      .onSnapshot(snapshot => {
        const meta = {};

        snapshot.docs.forEach(doc => {
          const data = doc.data();

          meta[doc.id] = {
            lastMessageText:
              data.lastMessageText || '',
            lastMessageAt:
              data.lastMessageAt?.toDate() || null,
            unreadCount:
              data.unreadCounts?.[currentUid] || 0,
          };
        });

        setConvMeta(meta);
      });

    return () => unsubscribe();
  }, [currentUid]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user =>
        user.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
      .map(user => {
        const convId = [currentUid, user.uid]
          .sort()
          .join('_');

        return {
          ...user,
          ...convMeta[convId],
        };
      })
      .sort((a, b) => {
        const tA = a.lastMessageAt?.getTime() || 0;
        const tB = b.lastMessageAt?.getTime() || 0;

        return tB - tA;
      });
  }, [users, searchQuery, convMeta, currentUid]);

  function formatTime(date) {
    if (!date) return '';

    const now = new Date();

    const diffDays = Math.floor(
      (now - date) / 86400000,
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (diffDays === 1) return 'Yesterday';

    if (diffDays < 7) {
      return date.toLocaleDateString([], {
        weekday: 'short',
      });
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  }

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
          <Image
            source={{ uri: item.image }}
            style={styles.avatarImg}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name
                ?.charAt(0)
                .toUpperCase()}
            </Text>
          </View>
        )}

        {item.isOnline && (
          <View style={styles.onlineDot} />
        )}
      </View>

      <View style={styles.textWrapper}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.userName,
              item.unreadCount > 0 &&
                styles.userNameBold,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {item.lastMessageAt ? (
            <Text style={styles.timeLabel}>
              {formatTime(item.lastMessageAt)}
            </Text>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.subtitle,
              item.unreadCount > 0 &&
                styles.subtitleUnread,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessageText || 'Tap to chat'}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99
                  ? '99+'
                  : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#002DE3"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Contacts
        </Text>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setsearchQuery}
      />

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
          <Text style={styles.emptyText}>
            No other users found
          </Text>
        }
      />
    </View>
  );
};

export default HomeScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      paddingTop: 30,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 23,
      fontWeight: '500',
      color: theme.textPrimary,
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
      color: theme.textPrimary,
      fontWeight: '600',
    },
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
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      flex: 1,
      marginRight: 8,
    },
    userNameBold: {
      fontWeight: '700',
    },
    timeLabel: {
      fontSize: 12,
      color: '#8E8E93',
    },
    subtitle: {
      fontSize: 13,
      color: '#8E8E93',
      flex: 1,
      marginRight: 8,
    },
    subtitleUnread: {
      color: theme.textPrimary,
      fontWeight: '500',
    },
    badge: {
      backgroundColor: '#002DE3',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    badgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#999',
    },
  });

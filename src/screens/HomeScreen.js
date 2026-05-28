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
      backgroundColor: '#a6a6a6',
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

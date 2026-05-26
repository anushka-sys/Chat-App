import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import React, { useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';

const SettingScreen = () => {
  const { isDark, toggleTheme ,theme} = useContext(ThemeContext);
   const styles = getStyles(theme);
  const navigation = useNavigation();
  const currentUser = auth().currentUser;
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName?.charAt(0).toUpperCase();


  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const options = [
    { icon: 'call-outline', label: 'Call', onPress: () => Alert.alert('Call', 'Coming soon!') },
    { icon: 'chatbubble-outline', label: 'Messages', onPress: () => navigation.navigate('Home') },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Notifications', 'Coming soon!') },
    { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => Alert.alert('Privacy', 'Coming soon!') },
    {
      icon: 'color-palette-outline',
      label: 'Appearance',
      isToggle: true,
      toggleValue: isDark,
      onToggle: toggleTheme,
    },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Help', 'Coming soon!') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{currentUser?.email}</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionItem,
              index < options.length - 1 && styles.optionBorder,
            ]}
            onPress={item.isToggle ? undefined : item.onPress}
            activeOpacity={item.isToggle ? 1 : 0.6}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconWrapper}>
                <Icon name={item.icon} size={20} color="#002DE3" />
              </View>
              <View>
                <Text style={styles.optionLabel}>{item.label}</Text>
                {item.isToggle && (
                  <Text style={styles.optionSubLabel}>
                    {item.toggleValue ? 'Dark mode on' : 'Dark mode off'}
                  </Text>
                )}
              </View>
            </View>

            {item.isToggle ? (
              <Switch
                value={item.toggleValue}
                onValueChange={item.onToggle}
                trackColor={{ false: '#e0e0e0', true: '#A0ABEF' }}
                thumbColor={item.toggleValue ? '#002DE3' : '#fff'}
                ios_backgroundColor="#e0e0e0"
              />
            ) : (
              <Icon name="chevron-forward" size={18} color="#ccc" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default SettingScreen;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#002DE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#002DE3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  optionsList: {
    marginHorizontal: 20,
    backgroundColor: theme.backgroundMuted,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.backgroundMuted,
    overflow: 'hidden',
    marginBottom: 28,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF1FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  optionSubLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#002DE3',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  logoutIcon: {
    marginTop: 1,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

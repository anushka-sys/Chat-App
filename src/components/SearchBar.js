import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';

const SearchBar = ({ value, onChangeText }) => {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Icon name="search-outline" size={18} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search users..."
        placeholderTextColor="#999"
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a1a',
  },
});

export default SearchBar;

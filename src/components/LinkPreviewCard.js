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
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getLinkPreview } from 'link-preview-js';

import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { TYPOGRAPHY, RADIUS, fontWeight } from '../constants/typograph';

// ─────────────────────────────────────────────
// LinkPreviewCard Component
// ─────────────────────────────────────────────
const LinkPreviewCard = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setPreview(null);
      return;
    }

    setLoading(true);
    getLinkPreview(url)
      .then(data => {
        setPreview(data);
        setLoading(false);
      })
      .catch(() => {
        setPreview(null);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <View style={previewStyles.container}>
        <Text style={previewStyles.loadingText}>Loading preview...</Text>
      </View>
    );
  }

  if (!preview) return null;

  return (
    <TouchableOpacity
      style={previewStyles.container}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
    >
      {preview.images?.[0] && (
        <Image
          source={{ uri: preview.images[0] }}
          style={previewStyles.image}
          resizeMode="cover"
        />
      )}
      <View style={previewStyles.textContainer}>
        {preview.siteName && (
          <Text style={previewStyles.siteName}>{preview.siteName}</Text>
        )}
        {preview.title && (
          <Text style={previewStyles.title} numberOfLines={2}>
            {preview.title}
          </Text>
        )}
        {preview.description && (
          <Text style={previewStyles.description} numberOfLines={2}>
            {preview.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const previewStyles = StyleSheet.create({
  previewWrapper: {
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
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: '#002DE3',
    marginTop: 6,
  },
  image: {
    width: '100%',
    height: 130,
  },
  textContainer: {
    padding: 8,
  },
  siteName: {
    fontSize: 11,
    color: '#002DE3',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
  loadingText: {
    padding: 10,
    color: '#999',
    fontSize: 12,
  },
});
export default LinkPreviewCard;
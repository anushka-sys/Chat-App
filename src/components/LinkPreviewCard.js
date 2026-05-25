import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { getLinkPreview } from 'link-preview-js';

const LinkPreviewCard = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset preview whenever url changes or is cleared
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
        // Silently fail — many sites block CORS; just hide the card
        setPreview(null);
        setLoading(false);
      });
  }, [url]);

  // Show loading state while fetching
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading preview...</Text>
      </View>
    );
  }

  // Nothing to show if fetch failed or no url
  if (!preview) return null;

  return (
    // Tapping the card opens the URL in the device browser
    <TouchableOpacity
      style={styles.container}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
    >
      {/* Show OG image if available */}
      {preview.images?.[0] && (
        <Image
          source={{ uri: preview.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.textContainer}>
        {/* Site name e.g. "YouTube", "GitHub" */}
        {preview.siteName && (
          <Text style={styles.siteName}>{preview.siteName}</Text>
        )}

        {/* Page title */}
        {preview.title && (
          <Text style={styles.title} numberOfLines={2}>
            {preview.title}
          </Text>
        )}

        {/* Page description */}
        {preview.description && (
          <Text style={styles.description} numberOfLines={2}>
            {preview.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LinkPreviewCard;

const styles = StyleSheet.create({
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
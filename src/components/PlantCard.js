import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function PlantCard({ plant, onPress }) {
  const { setSelectedPlant, setCurrentScreen } = useApp();

  const handlePress = () => {
    if (onPress) {
      onPress(plant);
    } else {
      setSelectedPlant(plant);
      setCurrentScreen('detail');
    }
  };

  const getBadgeStyle = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'organic':
        return { bg: '#227A45', text: '#FFFFFF' };
      case 'popular':
        return { bg: '#1E40AF', text: '#FFFFFF' };
      case 'best seller':
        return { bg: '#EA580C', text: '#FFFFFF' };
      case 'premium':
        return { bg: '#6B21A8', text: '#FFFFFF' };
      case 'fresh':
        return { bg: '#0D9488', text: '#FFFFFF' };
      default:
        return { bg: COLORS.primary, text: '#FFFFFF' };
    }
  };

  const badgeTheme = getBadgeStyle(plant.badge);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {/* Plant Image Container */}
      <View style={styles.imageContainer}>
        <Image source={plant.image} style={styles.image} />
        {plant.badge && (
          <View style={[styles.badge, { backgroundColor: badgeTheme.bg }]}>
            <Text style={[styles.badgeText, { color: badgeTheme.text }]}>
              {plant.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Card Info */}
      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.title} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.price}>₹{plant.price}</Text>
        </View>

        <Text style={styles.hindiName}>{plant.hindiName}</Text>

        {/* Rating and Stock */}
        <View style={styles.rowBottom}>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={11}
                color="#F59E0B"
                style={{ marginRight: 1 }}
              />
            ))}
          </View>
          <Text style={styles.stockText}>{plant.stock} kg left</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  content: {
    padding: 10,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 4,
  },
  hindiName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

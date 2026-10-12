import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastCard}>
        <Ionicons name="information-circle" size={18} color="#22C55E" />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.raised,
    maxWidth: '92%',
  },
  toastText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

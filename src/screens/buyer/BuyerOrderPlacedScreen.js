import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function BuyerOrderPlacedScreen() {
  const { lastPlacedOrder, setCurrentScreen } = useApp();

  const total = lastPlacedOrder ? lastPlacedOrder.totalPrice : 720;
  const itemsCount = lastPlacedOrder?.items ? lastPlacedOrder.items.length : 2;

  return (
    <View style={styles.container}>
      <AndroidStatusBar backgroundColor="#EDF5EE" dark />

      <View style={styles.content}>
        {/* Animated Green Checkmark Icon */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={48} color={COLORS.white} />
        </View>

        <Text style={styles.title}>Order Placed!</Text>

        <Text style={styles.totalInfo}>
          Total: ₹{total} · {itemsCount} items
        </Text>

        <Text style={styles.etaText}>
          Expected delivery in 2–3 business days
        </Text>

        {/* Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => setCurrentScreen('browse')}
            activeOpacity={0.88}
          >
            <Text style={styles.continueText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewOrdersBtn}
            onPress={() => setCurrentScreen('orders')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewOrdersText}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    ...SHADOWS.raised,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E5E28',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  totalInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  etaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  continueBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  viewOrdersBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewOrdersText: {
    color: '#1E5E28',
    fontSize: 14,
    fontWeight: '700',
  },
});

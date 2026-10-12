import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function BuyerMyOrdersScreen() {
  const { buyerOrders, reorderPast, setCurrentScreen, showToast } = useApp();

  const getStatusTheme = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { bg: '#E8F8F0', text: '#227A45' };
      case 'out for delivery':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'processing':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#FEF3C7', text: '#D97706' };
    }
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Purchase history"
        title="My Orders"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Receiving Dock Scan Notification */}
        <TouchableOpacity
          style={styles.dockScanBanner}
          onPress={() => {
            showToast('📦 Dock QR Scanner: Scan received bag QR sticker to verify');
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="barcode-outline" size={20} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.dockTitle}>Receiving Dock Verification</Text>
            <Text style={styles.dockSub}>Scan incoming batch QR to verify and release payment</Text>
          </View>
          <Ionicons name="scan" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Orders List */}
        <View style={styles.ordersList}>
          {buyerOrders.map((order) => {
            const statusTheme = getStatusTheme(order.status);
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.topRow}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}>
                    <Text style={[styles.statusText, { color: statusTheme.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemsText}>{order.itemsText}</Text>
                <Text style={styles.sellerText}>
                  From: {order.sellerText} · {order.timeText}
                </Text>

                <View style={styles.bottomRow}>
                  <Text style={styles.totalPrice}>₹{order.totalPrice}</Text>

                  <TouchableOpacity
                    style={styles.reorderBtn}
                    onPress={() => reorderPast(order)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  dockScanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    ...SHADOWS.card,
  },
  dockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dockSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemsText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  sellerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  reorderBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
});

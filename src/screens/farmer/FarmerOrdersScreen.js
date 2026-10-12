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

export default function FarmerOrdersScreen() {
  const { farmerOrders, setCurrentScreen, openChatWith, showToast } = useApp();

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { bg: '#E8F8F0', text: '#227A45' };
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
        subtitle="Sales history"
        title="Orders"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.ordersList}>
          {farmerOrders.map((order) => {
            const statusTheme = getStatusStyle(order.status);
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
                    <Text style={[styles.statusText, { color: statusTheme.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.plantRow}>
                  <Text style={styles.plantName}>
                    {order.plantName} · {order.quantity} kg
                  </Text>
                  <Text style={styles.totalPrice}>₹{order.totalPrice}</Text>
                </View>

                <Text style={styles.buyerName}>Buyer: {order.buyerName}</Text>
                <Text style={styles.timeText}>{order.timeText}</Text>

                {/* Quick Action Footer */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => openChatWith({ name: order.buyerName })}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.chatBtnText}>Chat with Buyer</Text>
                  </TouchableOpacity>

                  {order.status === 'Processing' && (
                    <TouchableOpacity
                      style={styles.dispatchBtn}
                      onPress={() => {
                        showToast(`✓ Order ${order.orderNumber} marked Dispatched`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="paper-plane" size={13} color={COLORS.white} />
                      <Text style={styles.dispatchBtnText}>Mark Dispatched</Text>
                    </TouchableOpacity>
                  )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  plantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 2,
  },
  plantName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  buyerName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F8F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dispatchBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});

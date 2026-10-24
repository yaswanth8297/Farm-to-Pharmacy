import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function BuyerCartScreen() {
  const {
    cart,
    plants,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('UPI / Instant Settlement');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.plant.price * item.quantity,
    0
  );
  const gstAmount = Math.round(subtotal * 0.05); // 5% AYUSH Botanical GST
  const grandTotal = subtotal + gstAmount;

  // Check if any cart item exceeds live inventory stock
  const stockIssues = cart.map((item) => {
    const livePlant = plants.find((p) => p.id === item.plant.id);
    const availableStock = livePlant ? livePlant.stock : item.plant.stock;
    return {
      name: item.plant.name,
      requested: item.quantity,
      available: availableStock,
      hasError: item.quantity > availableStock,
    };
  });

  const hasStockError = stockIssues.some((issue) => issue.hasError);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      showToast('⚠️ Your cart is empty');
      return;
    }
    const stockConflict = stockIssues.find((issue) => issue.hasError);
    if (stockConflict) {
      showToast(`⚠️ Only ${stockConflict.available} kg available for ${stockConflict.name}`);
      return;
    }
    try {
      const order = placeOrder(paymentMethod);
      if (order) {
        showToast('✓ Payment verified! Order confirmed');
        setCurrentScreen('orderPlaced');
      } else {
        showToast('⚠️ Could not complete order. Please retry.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      showToast(`⚠️ Order error: ${err.message || 'Please try again'}`);
    }
  };

  const paymentOptions = [
    { id: 'upi', label: 'UPI / Instant Settlement', icon: 'flash', sub: 'Google Pay, PhonePe, Paytm' },
    { id: 'escrow', label: 'AYUSH Dock Escrow', icon: 'shield-checkmark', sub: 'Pay after quality inspection at dock' },
    { id: 'netbanking', label: 'B2B Corporate Net Banking', icon: 'business', sub: 'NEFT / RTGS with GST invoice' },
  ];

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle={`${cart.length} plant batch${cart.length !== 1 ? 'es' : ''}`}
        title="My Cart"
        showBack
        onBack={() => setCurrentScreen('browse')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>
              Browse authenticated medicinal herb batches directly from growers
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => setCurrentScreen('browse')}
              accessibilityRole="button"
              accessibilityLabel="Browse Plants"
            >
              <Text style={styles.browseBtnText}>Browse Plants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {cart.map((item) => {
                const livePlant = plants.find((p) => p.id === item.plant.id);
                const availableStock = livePlant ? livePlant.stock : item.plant.stock;
                const isOverStock = item.quantity > availableStock;

                return (
                  <View key={item.plant.id} style={styles.cartCard}>
                    <Image source={item.plant.image} style={styles.itemImg} />

                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.plant.name}</Text>
                      <Text style={styles.farmerName}>
                        By {item.plant.farmerName}
                      </Text>
                      <Text style={styles.itemPrice}>
                        ₹{item.plant.price}/kg
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: isOverStock ? '#DC2626' : '#15803D',
                          marginTop: 3,
                        }}
                      >
                        {isOverStock
                          ? `⚠️ Only ${availableStock} kg in stock!`
                          : `✓ In stock: ${availableStock} kg`}
                      </Text>
                    </View>

                    <View style={styles.actionsCol}>
                      {/* Delete button */}
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeFromCart(item.plant.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.plant.name} from cart`}
                      >
                        <Ionicons name="close" size={14} color="#EF4444" />
                      </TouchableOpacity>

                      {/* Quantity stepper */}
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtnMinus}
                          onPress={() =>
                            updateCartQuantity(item.plant.id, item.quantity - 1)
                          }
                          accessibilityRole="button"
                          accessibilityLabel="Decrease quantity"
                        >
                          <Ionicons name="remove" size={14} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.stepNum}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtnPlus}
                          onPress={() =>
                            updateCartQuantity(item.plant.id, item.quantity + 1)
                          }
                          accessibilityRole="button"
                          accessibilityLabel="Increase quantity"
                        >
                          <Ionicons name="add" size={14} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Payment Method Selector */}
            <View style={[styles.summaryCard, { marginBottom: 12 }]}>
              <Text style={styles.summaryTitle}>Payment & Settlement</Text>
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setPaymentMethod(opt.label)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: isSelected ? COLORS.primary : '#E2E8F0',
                      backgroundColor: isSelected ? '#F0FDF4' : COLORS.white,
                      marginTop: 8,
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={opt.label}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? COLORS.primary : COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '700',
                          color: COLORS.textPrimary,
                        }}
                      >
                        {opt.label}
                      </Text>
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 1 }}>
                        {opt.sub}
                      </Text>
                    </View>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? COLORS.primary : COLORS.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Order Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tax & Logistics Invoice</Text>

              {cart.map((item) => (
                <View key={item.plant.id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.plant.name} × {item.quantity} kg
                  </Text>
                  <Text style={styles.summaryVal}>
                    ₹{(item.plant.price * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>AYUSH GST (5%)</Text>
                <Text style={styles.summaryVal}>₹{gstAmount.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Farm-to-Lab Cold Chain Transit</Text>
                <Text style={styles.summaryFree}>FREE</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryTotalRow}>
                <Text style={styles.totalLabel}>Grand Total (Incl. GST)</Text>
                <Text style={styles.totalVal}>₹{grandTotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Place Order CTA Button */}
            <TouchableOpacity
              style={[
                styles.placeOrderBtn,
                hasStockError && styles.placeOrderBtnWarning,
              ]}
              onPress={handlePlaceOrder}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Place Order"
            >
              <Ionicons
                name={hasStockError ? 'alert-circle-outline' : 'shield-checkmark-outline'}
                size={18}
                color={COLORS.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.placeOrderText}>
                {hasStockError
                  ? 'Resolve Stock Conflicts'
                  : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: 110,
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  browseBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  itemsList: {
    gap: 12,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  farmerName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 4,
  },
  actionsCol: {
    alignItems: 'flex-end',
    gap: 10,
  },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtnMinus: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnPlus: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 14,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryFree: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#1E5E28',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.raised,
    marginTop: 8,
    cursor: 'pointer',
  },
  placeOrderBtnWarning: {
    backgroundColor: '#D97706',
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

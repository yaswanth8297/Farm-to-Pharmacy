import React from 'react';
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
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    setCurrentScreen,
  } = useApp();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.plant.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    const order = placeOrder();
    if (order) {
      setCurrentScreen('orderPlaced');
    }
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle={`${cart.length} items`}
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
            >
              <Text style={styles.browseBtnText}>Browse Plants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {cart.map((item) => (
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
                  </View>

                  <View style={styles.actionsCol}>
                    {/* Delete button */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(item.plant.id)}
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
                      >
                        <Ionicons name="remove" size={14} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.stepNum}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtnPlus}
                        onPress={() =>
                          updateCartQuantity(item.plant.id, item.quantity + 1)
                        }
                      >
                        <Ionicons name="add" size={14} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              {cart.map((item) => (
                <View key={item.plant.id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.plant.name} × {item.quantity} kg
                  </Text>
                  <Text style={styles.summaryVal}>
                    ₹{item.plant.price * item.quantity}
                  </Text>
                </View>
              ))}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryFree}>FREE</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryTotalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalVal}>₹{totalAmount}</Text>
              </View>
            </View>

            {/* Place Order CTA Button */}
            <TouchableOpacity
              style={styles.placeOrderBtn}
              onPress={handlePlaceOrder}
              activeOpacity={0.88}
            >
              <Text style={styles.placeOrderText}>
                Place Order · ₹{totalAmount}
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
    paddingBottom: 24,
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
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.raised,
    marginTop: 4,
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function BottomTabBar() {
  const { role, currentScreen, setCurrentScreen, cart } = useApp();

  const isFarmer = role === 'farmer';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isFarmer) {
    return (
      <View style={styles.barContainer}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={currentScreen === 'home' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'home' && styles.tabLabelActive,
            ]}
          >
            Home
          </Text>
          {currentScreen === 'home' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 2: Center Raised Upload Button */}
        <TouchableOpacity
          style={styles.raisedUploadWrapper}
          onPress={() => setCurrentScreen('upload')}
          activeOpacity={0.85}
        >
          <View style={styles.raisedUploadButton}>
            <Ionicons name="arrow-up-circle-outline" size={26} color={COLORS.white} />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'upload' && styles.tabLabelActive,
              { marginTop: 4 },
            ]}
          >
            Upload
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Listings */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('listings')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'listings' ? 'list' : 'list-outline'}
            size={22}
            color={currentScreen === 'listings' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'listings' && styles.tabLabelActive,
            ]}
          >
            Listings
          </Text>
          {currentScreen === 'listings' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 4: Rewards */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('rewards')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'rewards' ? 'star' : 'star-outline'}
            size={22}
            color={currentScreen === 'rewards' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'rewards' && styles.tabLabelActive,
            ]}
          >
            Rewards
          </Text>
          {currentScreen === 'rewards' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 5: Orders */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('orders')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'orders' ? 'receipt' : 'receipt-outline'}
            size={22}
            color={currentScreen === 'orders' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'orders' && styles.tabLabelActive,
            ]}
          >
            Orders
          </Text>
          {currentScreen === 'orders' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    );
  }

  // Buyer / Pharmacy Technician Bottom Tab Bar
  return (
    <View style={styles.barContainer}>
      {/* Tab 1: Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setCurrentScreen('home')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentScreen === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={currentScreen === 'home' ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            currentScreen === 'home' && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
        {currentScreen === 'home' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Tab 2: Browse */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setCurrentScreen('browse')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentScreen === 'browse' ? 'search' : 'search-outline'}
          size={22}
          color={currentScreen === 'browse' ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            currentScreen === 'browse' && styles.tabLabelActive,
          ]}
        >
          Browse
        </Text>
        {currentScreen === 'browse' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Tab 3: Cart with badge */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setCurrentScreen('cart')}
        activeOpacity={0.7}
      >
        <View style={styles.cartIconWrapper}>
          <Ionicons
            name={currentScreen === 'cart' ? 'cart' : 'cart-outline'}
            size={22}
            color={currentScreen === 'cart' ? COLORS.primary : COLORS.textMuted}
          />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabLabel,
            currentScreen === 'cart' && styles.tabLabelActive,
          ]}
        >
          Cart
        </Text>
        {currentScreen === 'cart' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Tab 4: Orders */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setCurrentScreen('orders')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentScreen === 'orders' ? 'receipt' : 'receipt-outline'}
          size={22}
          color={currentScreen === 'orders' ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            currentScreen === 'orders' && styles.tabLabelActive,
          ]}
        >
          Orders
        </Text>
        {currentScreen === 'orders' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Tab 5: Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setCurrentScreen('profile')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentScreen === 'profile' ? 'person' : 'person-outline'}
          size={22}
          color={currentScreen === 'profile' ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            currentScreen === 'profile' && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
        {currentScreen === 'profile' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    ...SHADOWS.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 4,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    width: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  raisedUploadWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -22,
  },
  raisedUploadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.raised,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
});

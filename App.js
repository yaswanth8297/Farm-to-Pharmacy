import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { COLORS } from './src/constants/theme';
import BottomTabBar from './src/components/BottomTabBar';
import QrProvenanceModal from './src/components/QrProvenanceModal';
import MessageModal from './src/components/MessageModal';
import Toast from './src/components/Toast';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import FarmerHomeScreen from './src/screens/farmer/FarmerHomeScreen';
import FarmerUploadScreen from './src/screens/farmer/FarmerUploadScreen';
import FarmerListingsScreen from './src/screens/farmer/FarmerListingsScreen';
import FarmerRewardsScreen from './src/screens/farmer/FarmerRewardsScreen';
import FarmerOrdersScreen from './src/screens/farmer/FarmerOrdersScreen';
import FarmerProfileScreen from './src/screens/farmer/FarmerProfileScreen';
import NotificationsScreen from './src/screens/shared/NotificationsScreen';

import BuyerHomeScreen from './src/screens/buyer/BuyerHomeScreen';
import BuyerPlantDetailScreen from './src/screens/buyer/BuyerPlantDetailScreen';
import BuyerBrowseScreen from './src/screens/buyer/BuyerBrowseScreen';
import BuyerCartScreen from './src/screens/buyer/BuyerCartScreen';
import BuyerOrderPlacedScreen from './src/screens/buyer/BuyerOrderPlacedScreen';
import BuyerMyOrdersScreen from './src/screens/buyer/BuyerMyOrdersScreen';
import BuyerProfileScreen from './src/screens/buyer/BuyerProfileScreen';

function MainNavigator() {
  const { role, currentScreen } = useApp();

  // If no role chosen, show splash & role selection
  if (!role) {
    return <SplashScreen />;
  }

  // Farmer Screens
  if (role === 'farmer') {
    switch (currentScreen) {
      case 'home':
        return <FarmerHomeScreen />;
      case 'upload':
        return <FarmerUploadScreen />;
      case 'listings':
        return <FarmerListingsScreen />;
      case 'rewards':
        return <FarmerRewardsScreen />;
      case 'orders':
        return <FarmerOrdersScreen />;
      case 'profile':
        return <FarmerProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <FarmerHomeScreen />;
    }
  }

  // Buyer / Pharmacy Technician Screens
  if (role === 'buyer') {
    switch (currentScreen) {
      case 'home':
        return <BuyerHomeScreen />;
      case 'browse':
        return <BuyerBrowseScreen />;
      case 'detail':
        return <BuyerPlantDetailScreen />;
      case 'cart':
        return <BuyerCartScreen />;
      case 'orderPlaced':
        return <BuyerOrderPlacedScreen />;
      case 'orders':
        return <BuyerMyOrdersScreen />;
      case 'profile':
        return <BuyerProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <BuyerHomeScreen />;
    }
  }

  return <SplashScreen />;
}

function AppContent() {
  const { role, currentScreen } = useApp();

  // Hide bottom tab bar on certain screens (splash, plant detail, order placed)
  const hideTabBar =
    !role ||
    currentScreen === 'detail' ||
    currentScreen === 'orderPlaced' ||
    currentScreen === 'upload';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <MainNavigator />
        </View>

        {!hideTabBar && <BottomTabBar />}

        {/* Global Overlays & Modals */}
        <QrProvenanceModal />
        <MessageModal />
        <Toast />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#0F172A' : COLORS.primaryHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  screenContainer: {
    flex: 1,
  },
});

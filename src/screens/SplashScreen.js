import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import AndroidStatusBar from '../components/AndroidStatusBar';

export default function SplashScreen() {
  const { setRole, setCurrentScreen } = useApp();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar dark backgroundColor="#EDF5EE" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImg}
            />
          </View>
          <Text style={styles.appTitle}>Farm To Pharmacy</Text>
          <Text style={styles.appSubtitle}>
            Connecting farmers with pharmacy technicians for medicinal plants
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Farmer */}
          <TouchableOpacity
            style={styles.farmerCard}
            onPress={() => handleSelectRole('farmer')}
            activeOpacity={0.9}
          >
            <Image
              source={require('../../assets/images/farmer_role.png')}
              style={styles.roleThumbnail}
            />
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I'm a Farmer</Text>
              <Text style={styles.roleHindi}>मैं एक किसान हूँ</Text>
              <Text style={styles.roleDesc}>
                Upload medicinal plants · Earn reward points · Redeem discounts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Card 2: Pharma Tech */}
          <TouchableOpacity
            style={styles.pharmaCard}
            onPress={() => handleSelectRole('buyer')}
            activeOpacity={0.9}
          >
            <Image
              source={require('../../assets/images/pharma_role.png')}
              style={styles.roleThumbnail}
            />
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I'm a Pharma Tech</Text>
              <Text style={styles.roleHindi}>मैं फार्मासिस्ट हूँ</Text>
              <Text style={styles.roleDesc}>
                Browse plants · Purchase in ₹ · Direct from farmers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Trust Badges Footer */}
        <View style={styles.footer}>
          <Text style={styles.trustText}>Certified & Trusted Platform</Text>
          <View style={styles.badgesRow}>
            <Text style={styles.badgeItem}>🌱 100% Organic</Text>
            <Text style={styles.badgeItem}>🔒 Secure Pay</Text>
            <Text style={styles.badgeItem}>⭐ 4.8 Rating</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5EE',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.raised,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E5E28',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#4B6B50',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  cardsContainer: {
    gap: 16,
    marginVertical: 10,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#267B3B',
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.card,
  },
  pharmaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03695D',
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.card,
  },
  roleThumbnail: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginRight: 14,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  roleHindi: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 1,
  },
  roleDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    lineHeight: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  trustText: {
    fontSize: 12,
    color: '#557B5A',
    fontWeight: '600',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  badgeItem: {
    fontSize: 11,
    color: '#3F6E45',
    fontWeight: '600',
  },
});

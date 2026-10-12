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
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function FarmerProfileScreen() {
  const {
    setCurrentScreen,
    setRole,
    farmerListings,
    rewardPoints,
    openChatWith,
    showToast,
  } = useApp();

  const menuItems = [
    {
      id: 'listings',
      icon: 'clipboard-outline',
      label: 'My Listings',
      action: () => setCurrentScreen('listings'),
    },
    {
      id: 'messages',
      icon: 'chatbubble-ellipses-outline',
      label: 'Messages',
      action: () => openChatWith({ name: 'Dr. Priya Sharma (City Pharma)' }),
    },
    {
      id: 'rewards',
      icon: 'star-outline',
      label: `Reward Points — ${rewardPoints.toLocaleString()} pts`,
      action: () => setCurrentScreen('rewards'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notification Settings',
      action: () => setCurrentScreen('notifications'),
    },
    {
      id: 'privacy',
      icon: 'lock-closed-outline',
      label: 'Privacy & Security',
      action: () => showToast('Masked contact & GPS privacy active'),
    },
    {
      id: 'help',
      icon: 'call-outline',
      label: 'Help & Support',
      action: () => showToast('Krishi Kendra support: 1800-180-1551'),
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Settings',
      action: () => showToast('Vernacular language: English / हिन्दी'),
    },
  ];

  return (
    <View style={styles.container}>
      <AndroidStatusBar backgroundColor={COLORS.primaryHeader} />

      {/* Top Green Hero Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.profileInfoRow}>
          <View style={styles.avatarBox}>
            <Image
              source={require('../../../assets/images/farmer_avatar.png')}
              style={styles.avatarImg}
            />
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.farmerName}>Ramesh Kumar</Text>
            <Text style={styles.farmerRole}>🌿 Certified Organic Farmer</Text>

            <View style={styles.badgeRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
              <Text style={styles.locationText}>Pune, Maharashtra</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{farmerListings.length + 8}</Text>
            <Text style={styles.statLbl}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>₹14.2k</Text>
            <Text style={styles.statLbl}>Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{rewardPoints}</Text>
            <Text style={styles.statLbl}>Points</Text>
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
              activeOpacity={0.75}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={COLORS.primary}
                style={styles.menuIcon}
              />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Role Switcher & Logout */}
        <View style={styles.buttonsFooter}>
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={() => {
              setRole('buyer');
              setCurrentScreen('home');
              showToast('Switched to Pharmacy Technician Mode');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.switchRoleText}>
              Switch Role (Switch to Pharmacy Technician)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              setRole(null);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
  profileHeader: {
    backgroundColor: COLORS.primaryHeader,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    marginRight: 16,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  farmerRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  verifiedBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#451A03',
  },
  locationText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.card,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  menuContainer: {
    gap: 8,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  buttonsFooter: {
    gap: 10,
  },
  switchRoleBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  switchRoleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});

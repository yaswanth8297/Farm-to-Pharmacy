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

export default function FarmerHomeScreen() {
  const {
    setCurrentScreen,
    rewardPoints,
    farmerListings,
    farmerOrders,
    openProvenance,
    setAiScanModalVisible,
  } = useApp();

  const totalEarned = farmerListings.reduce((sum, l) => sum + (l.earned || 0), 14200);

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Reward Points Golden Balance Card */}
        <View style={styles.goldCard}>
          <View style={styles.goldCardTop}>
            <View>
              <Text style={styles.goldCardSubtitle}>Reward Points Balance</Text>
              <Text style={styles.goldCardPoints}>{rewardPoints.toLocaleString()} pts</Text>
              <Text style={styles.goldCardValue}>
                ≈ ₹{Math.floor(rewardPoints / 2)} discount on supplies
              </Text>
            </View>

            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => setCurrentScreen('rewards')}
              activeOpacity={0.85}
            >
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goldCardBottom}>
            <Text style={styles.goldMemberText}>⭐ Gold Member</Text>
          </View>
        </View>

        {/* 3 Metric Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="leaf" size={18} color="#15803D" />
            </View>
            <Text style={styles.statNumber}>{farmerListings.length + 8}</Text>
            <Text style={styles.statLabel}>Total Listings</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="cash" size={18} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>₹14.2k</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="cube" size={18} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{farmerOrders.length + 44}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Big Action Card: Upload Medicinal Plants */}
        <TouchableOpacity
          style={styles.uploadActionCard}
          onPress={() => setCurrentScreen('upload')}
          activeOpacity={0.9}
        >
          <View style={styles.uploadIconCircle}>
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.white} />
          </View>
          <View style={styles.uploadTextContainer}>
            <Text style={styles.uploadCardTitle}>Upload Medicinal Plants</Text>
            <Text style={styles.uploadCardSubtitle}>
              Earn 25–85 points per listing
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* AI Quick Field Scan Shortcut */}
        <TouchableOpacity
          style={styles.aiQuickScanCard}
          onPress={() => setAiScanModalVisible(true)}
          activeOpacity={0.9}
        >
          <Ionicons name="scan-circle" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.aiQuickTitle}>AI Weed & Leaf Identifier</Text>
            <Text style={styles.aiQuickSubtitle}>Scan unknown wild plants to check pharmacy value</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI Vision</Text>
          </View>
        </TouchableOpacity>

        {/* Recent Listings Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Listings</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('listings')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listingsList}>
          {farmerListings.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listingCard}
              onPress={() => openProvenance(item)}
              activeOpacity={0.88}
            >
              <Image source={item.image} style={styles.listingImg} />
              <View style={styles.listingInfo}>
                <Text style={styles.listingName}>{item.name}</Text>
                <Text style={styles.listingSubtitle}>
                  {item.quantity} kg · {item.timeText}
                </Text>
              </View>
              <View style={styles.listingRight}>
                <View
                  style={[
                    styles.statusPill,
                    item.status === 'Sold'
                      ? styles.statusSold
                      : item.status === 'Pending'
                      ? styles.statusPending
                      : styles.statusLive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === 'Sold'
                        ? styles.statusTextSold
                        : item.status === 'Pending'
                        ? styles.statusTextPending
                        : styles.statusTextLive,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.listingPrice}>₹{item.pricePerKg}/kg</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Agrarian Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipTitle}>💡 Today's Tip</Text>
          </View>
          <Text style={styles.tipContent}>
            Ashwagandha roots harvested in November command premium pricing due to high withanolide concentration.
          </Text>
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
    gap: 14,
  },
  goldCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.card,
  },
  goldCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goldCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  goldCardPoints: {
    fontSize: 26,
    fontWeight: '800',
    color: '#451A03',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  goldCardValue: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  redeemButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...SHADOWS.card,
  },
  redeemButtonText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  goldCardBottom: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  goldMemberText: {
    fontSize: 11,
    color: '#78350F',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  uploadActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    padding: 16,
    ...SHADOWS.card,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  uploadCardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  aiQuickScanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    ...SHADOWS.card,
  },
  aiQuickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  aiQuickSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  aiBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listingsList: {
    gap: 8,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listingImg: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
  },
  listingInfo: {
    flex: 1,
  },
  listingName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listingSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listingRight: {
    alignItems: 'flex-end',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusLive: {
    backgroundColor: '#E8F8F0',
  },
  statusSold: {
    backgroundColor: '#FEF3C7',
  },
  statusPending: {
    backgroundColor: '#FFEDD5',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextLive: {
    color: '#227A45',
  },
  statusTextSold: {
    color: '#D97706',
  },
  statusTextPending: {
    color: '#EA580C',
  },
  listingPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tipCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipHeader: {
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  tipContent: {
    fontSize: 11,
    color: '#1F2937',
    lineHeight: 16,
  },
});

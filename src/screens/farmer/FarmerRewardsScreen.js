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
import { INITIAL_REWARD_VOUCHERS } from '../../constants/plantData';

export default function FarmerRewardsScreen() {
  const { rewardPoints, redeemVoucher, setCurrentScreen } = useApp();

  const platinumTarget = 1500;
  const progressRatio = Math.min(rewardPoints / platinumTarget, 1);
  const pointsRemaining = Math.max(platinumTarget - rewardPoints, 0);

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Your green earnings"
        title="Rewards"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Points Balance Card */}
        <View style={styles.goldCard}>
          <Text style={styles.goldSubtitle}>Total Points Balance</Text>
          <Text style={styles.goldBalance}>{rewardPoints.toLocaleString()}</Text>
          <Text style={styles.goldValue}>
            ≈ ₹{Math.floor(rewardPoints / 2)} redeemable value
          </Text>

          <View style={styles.tierRow}>
            <View style={styles.goldMemberBadge}>
              <Text style={styles.goldMemberText}>⭐ Gold Member</Text>
            </View>
            <Text style={styles.nextTierText}>Next: 1,500 pts → Platinum</Text>
          </View>
        </View>

        {/* Progress Bar Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to Platinum</Text>
            <Text style={styles.progressFraction}>
              {rewardPoints} / {platinumTarget} pts
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressRatio * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.progressSub}>
            {pointsRemaining > 0
              ? `${pointsRemaining} more points to unlock Platinum benefits`
              : '🎉 You have unlocked Platinum tier! Enjoy 0% listing fee.'}
          </Text>
        </View>

        {/* Redeem Points Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎁 Redeem Points</Text>
        </View>

        <View style={styles.vouchersGrid}>
          {INITIAL_REWARD_VOUCHERS.map((v) => {
            const canAfford = rewardPoints >= v.points;
            return (
              <View key={v.id} style={styles.voucherCard}>
                <View style={styles.voucherIconBox}>
                  <Ionicons name={v.iconName} size={22} color={v.iconColor} />
                </View>
                <Text style={styles.voucherTitle}>{v.title}</Text>
                <Text style={styles.voucherDesc}>{v.desc}</Text>

                <TouchableOpacity
                  style={[
                    styles.redeemBtn,
                    !canAfford && styles.redeemBtnDisabled,
                  ]}
                  onPress={() => redeemVoucher(v)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.redeemBtnText,
                      !canAfford && styles.redeemBtnTextDisabled,
                    ]}
                  >
                    Redeem
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Points History Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📜 Points History</Text>
        </View>

        <View style={styles.historyList}>
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="leaf" size={16} color="#15803D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>Tulsi Listing Verified</Text>
              <Text style={styles.historyTime}>Today, 9:30 AM</Text>
            </View>
            <Text style={styles.historyPtsGreen}>+150 pts</Text>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="checkmark-done-circle" size={16} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>Neem Batch Order Completed</Text>
              <Text style={styles.historyTime}>Yesterday</Text>
            </View>
            <Text style={styles.historyPtsGreen}>+140 pts</Text>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="gift" size={16} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>First AI Leaf Upload Bonus</Text>
              <Text style={styles.historyTime}>18 Jul 2026</Text>
            </View>
            <Text style={styles.historyPtsGreen}>+72 pts</Text>
          </View>
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
  goldSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  goldBalance: {
    fontSize: 32,
    fontWeight: '800',
    color: '#451A03',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  goldValue: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  goldMemberBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goldMemberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#451A03',
  },
  nextTierText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressFraction: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  vouchersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  voucherCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  voucherIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  voucherDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginVertical: 4,
    textAlign: 'center',
  },
  redeemBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  redeemBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  redeemBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  redeemBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  historyList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F8F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historyTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  historyPtsGreen: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
});

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

export default function FarmerListingsScreen() {
  const {
    farmerListings,
    openProvenance,
    offlineDrafts,
    addFarmerListing,
    removeOfflineDraft,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Live' | 'Sold'

  const filteredListings = farmerListings.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleSyncDraft = (draft) => {
    addFarmerListing(draft);
    removeOfflineDraft(draft.id);
    showToast(`✓ Offline Draft ${draft.name} synced to live marketplace!`);
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Your medicinal plants"
        title="My Listings"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter Pills Row matching Figma */}
        <View style={styles.filterPillsRow}>
          {['All', 'Live', 'Sold'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Offline Drafts Section (if any exist) */}
        {offlineDrafts.length > 0 && (
          <View style={styles.draftsSection}>
            <View style={styles.draftsHeader}>
              <Ionicons name="cloud-offline" size={16} color="#D97706" />
              <Text style={styles.draftsTitle}>
                Offline Drafts ({offlineDrafts.length})
              </Text>
            </View>
            {offlineDrafts.map((d) => (
              <View key={d.id} style={styles.draftCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.draftName}>{d.name} ({d.quantity} kg)</Text>
                  <Text style={styles.draftTime}>Cached locally · ₹{d.pricePerKg}/kg</Text>
                </View>
                <TouchableOpacity
                  style={styles.syncBtn}
                  onPress={() => handleSyncDraft(d)}
                >
                  <Ionicons name="sync" size={14} color={COLORS.white} />
                  <Text style={styles.syncBtnText}>Sync Live</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Listings List */}
        <View style={styles.listContainer}>
          {filteredListings.map((item) => {
            const isLive = item.status === 'Live';
            const isSold = item.status === 'Sold';
            const isPending = item.status === 'Pending';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.listingCard}
                onPress={() => openProvenance(item)}
                activeOpacity={0.88}
              >
                <Image source={item.image} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  <View style={styles.topRow}>
                    <Text style={styles.plantName}>{item.name}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        isLive && styles.statusLive,
                        isSold && styles.statusSold,
                        isPending && styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isLive && styles.statusTextLive,
                          isSold && styles.statusTextSold,
                          isPending && styles.statusTextPending,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.availableText}>
                    {item.quantity} kg available
                  </Text>

                  <View style={styles.metricsRow}>
                    <View>
                      <Text style={styles.metricLabel}>Earned</Text>
                      <Text style={styles.earnedVal}>
                        ₹{item.earned ? item.earned.toLocaleString() : (item.quantity * item.pricePerKg).toLocaleString()}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.metricLabel}>Points</Text>
                      <Text style={styles.pointsVal}>+{item.points || 120} pts</Text>
                    </View>

                    <View style={styles.qrButtonMini}>
                      <Ionicons name="qr-code-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.qrMiniText}>QR Code</Text>
                    </View>
                  </View>

                  <Text style={styles.timeFooter}>{item.timeText}</Text>
                </View>
              </TouchableOpacity>
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
    gap: 14,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#1E5E28',
    borderColor: '#1E5E28',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  draftsSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  draftsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  draftsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  draftName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  draftTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  syncBtnText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
  statusText: {
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
  availableText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  earnedVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  pointsVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  qrButtonMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F8F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  qrMiniText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  timeFooter: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});

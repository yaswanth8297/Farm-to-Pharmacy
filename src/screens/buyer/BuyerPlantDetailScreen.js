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
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function BuyerPlantDetailScreen() {
  const {
    selectedPlant,
    setCurrentScreen,
    addToCart,
    openProvenance,
    openChatWith,
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!selectedPlant) return null;

  const plant = selectedPlant;
  const totalPrice = plant.price * quantity;

  return (
    <View style={styles.container}>
      <AndroidStatusBar backgroundColor="transparent" dark />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Hero Image Header */}
        <View style={styles.heroContainer}>
          <Image
            source={plant.heroImage || plant.image}
            style={styles.heroImage}
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('browse')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {plant.badge && (
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>{plant.badge}</Text>
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Title & Price Header */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{plant.name}</Text>
              <Text style={styles.hindiSubtitle}>
                {plant.hindiName} · {plant.tag}
              </Text>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.price}>₹{plant.price}</Text>
              <Text style={styles.priceUnit}>per kg</Text>
            </View>
          </View>

          {/* Star Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name="star"
                size={14}
                color="#F59E0B"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.ratingText}>
              {plant.rating} ({plant.reviewsCount} reviews)
            </Text>
          </View>

          {/* Farmer Info Card */}
          <View style={styles.farmerCard}>
            <Image
              source={require('../../../assets/images/farmer_avatar.png')}
              style={styles.farmerAvatar}
            />
            <View style={styles.farmerTextGroup}>
              <Text style={styles.farmerName}>{plant.farmerName}</Text>
              <View style={styles.farmerLocationRow}>
                <Ionicons name="location" size={12} color="#DC2626" />
                <Text style={styles.farmerLocation}>
                  {plant.farmerLocation}
                </Text>
                <Text style={styles.verifiedTag}>✓ Verified</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.messageBtn}
              onPress={() => openChatWith({ name: plant.farmerName })}
              activeOpacity={0.8}
            >
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* QR Provenance Audit Button Card */}
          <TouchableOpacity
            style={styles.provenanceTriggerCard}
            onPress={() => openProvenance(plant)}
            activeOpacity={0.85}
          >
            <Ionicons name="qr-code-outline" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.provTitle}>Dynamic QR Batch Provenance</Text>
              <Text style={styles.provSub}>
                Inspect farm GPS, harvest date & AYUSH lab purity test
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Medicinal Benefits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Medicinal Benefits</Text>
            <Text style={styles.benefitsSummary}>
              {plant.medicinalBenefits}
            </Text>

            <View style={styles.tagsRow}>
              {plant.benefitTags?.map((tag, idx) => (
                <View key={idx} style={styles.benefitTagPill}>
                  <Text style={styles.benefitTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Botanical Profile</Text>
            <Text style={styles.descriptionText}>{plant.description}</Text>
            <Text style={styles.scientificName}>
              Scientific Name: {plant.scientificName}
            </Text>
          </View>

          {/* Stock & Quantity Stepper */}
          <View style={styles.stockStepperRow}>
            <View>
              <Text style={styles.stockLabel}>Available Stock</Text>
              <Text style={styles.stockValue}>{plant.stock} kg</Text>
            </View>

            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>{quantity}</Text>
              <TouchableOpacity
                style={[
                  styles.stepBtn,
                  styles.stepBtnAdd,
                  quantity >= (plant.stock || 50) && { backgroundColor: COLORS.textMuted },
                ]}
                onPress={() => setQuantity(Math.min(plant.stock || 50, quantity + 1))}
                disabled={quantity >= (plant.stock || 50)}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalLabel}>Total ({quantity} kg)</Text>
              <Text style={styles.totalValue}>₹{totalPrice.toLocaleString('en-IN')}</Text>
              <Text style={{ fontSize: 10, color: plant.stock > 0 ? '#15803D' : '#DC2626', fontWeight: '700', marginTop: 2 }}>
                {plant.stock > 0 ? `${plant.stock} kg available` : 'Out of Stock'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            (plant.stock <= 0) && { backgroundColor: COLORS.textMuted },
          ]}
          onPress={() => {
            if (plant.stock <= 0) return;
            addToCart(plant, quantity);
            setCurrentScreen('cart');
          }}
          disabled={plant.stock <= 0}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={plant.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        >
          <Ionicons name="cart-outline" size={18} color={COLORS.white} />
          <Text style={styles.addToCartText}>
            {plant.stock <= 0
              ? 'Out of Stock'
              : `Add to Cart · ₹${totalPrice.toLocaleString('en-IN')}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  badgeBox: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#227A45',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  body: {
    padding: 18,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  hindiSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  priceUnit: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  farmerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  farmerTextGroup: {
    flex: 1,
  },
  farmerName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  farmerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  farmerLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  verifiedTag: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: '700',
    marginLeft: 4,
  },
  messageBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  messageBtnText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  provenanceTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    ...SHADOWS.card,
  },
  provTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  provSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  benefitsSummary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTagPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitTagText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  scientificName: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginTop: 6,
  },
  stockStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stockLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  stockValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnAdd: {
    backgroundColor: COLORS.primary,
  },
  stepCount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 18,
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...SHADOWS.raised,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 16,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

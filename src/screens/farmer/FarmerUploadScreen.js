import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import AndroidStatusBar from '../../components/AndroidStatusBar';
import { INITIAL_PLANTS } from '../../constants/plantData';
import AiScanModal from '../../components/AiScanModal';

export default function FarmerUploadScreen() {
  const {
    setCurrentScreen,
    addFarmerListing,
    saveOfflineDraft,
    openProvenance,
    aiScanModalVisible,
    setAiScanModalVisible,
    showToast,
  } = useApp();

  const [selectedPlant, setSelectedPlant] = useState(INITIAL_PLANTS[0]); // Tulsi by default
  const [quantity, setQuantity] = useState('10');
  const [pricePerKg, setPricePerKg] = useState('120');
  const [harvestDate, setHarvestDate] = useState('Today, 12 Oct 2026');
  const [notes, setNotes] = useState('Organically grown along irrigation bunds.');
  const [photoAdded, setPhotoAdded] = useState(true);

  const plantTypes = [
    INITIAL_PLANTS[0], // Tulsi
    INITIAL_PLANTS[1], // Aloe Vera
    INITIAL_PLANTS[2], // Neem
    INITIAL_PLANTS[3], // Turmeric
    INITIAL_PLANTS[4], // Moringa
    INITIAL_PLANTS[5], // Mint
    INITIAL_PLANTS[6], // Ashwagandha
    INITIAL_PLANTS[7], // Brahmi
    INITIAL_PLANTS[8], // Amla
  ];

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setPricePerKg(plant.price.toString());
  };

  const handleAiDetected = (plant) => {
    setSelectedPlant(plant);
    setPricePerKg(plant.price.toString());
    setQuantity('15');
    setPhotoAdded(true);
    showToast(`✓ AI Selected ${plant.name} - Benchmark ₹${plant.price}/kg applied`);
  };

  const handlePublish = () => {
    if (!quantity || !pricePerKg) {
      showToast('⚠️ Please enter quantity and price');
      return;
    }

    const createdItem = addFarmerListing({
      plantId: selectedPlant.id,
      name: selectedPlant.name,
      scientificName: selectedPlant.scientificName,
      hindiName: selectedPlant.hindiName,
      category: selectedPlant.category,
      quantity: quantity,
      pricePerKg: pricePerKg,
      harvestDate: harvestDate,
      image: selectedPlant.image,
      activeCompounds: selectedPlant.activeCompounds,
      medicinalBenefits: selectedPlant.medicinalBenefits,
      description: notes,
    });

    // Directly open QR code provenance modal for instant feedback
    openProvenance(createdItem);
    setCurrentScreen('listings');
  };

  const handleSaveDraft = async () => {
    await saveOfflineDraft({
      plantId: selectedPlant.id,
      name: selectedPlant.name,
      quantity: quantity,
      pricePerKg: pricePerKg,
      harvestDate: harvestDate,
      image: selectedPlant.image,
    });
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Earn reward points"
        title="Upload Plant"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1: Add Plant Photos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📷 Add Plant Photos</Text>
          </View>
          <View style={styles.photoButtonsRow}>
            {/* Take Photo with AI Leaf Recognition */}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => setAiScanModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.photoIconBox}>
                <Ionicons name="camera-outline" size={26} color={COLORS.primary} />
              </View>
              <Text style={styles.photoButtonText}>Take Photo</Text>
              <Text style={styles.photoButtonSub}>AI Leaf ID</Text>
            </TouchableOpacity>

            {/* Gallery */}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => {
                setPhotoAdded(true);
                showToast('Photo selected from device gallery');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.photoIconBox}>
                <Ionicons name="images-outline" size={26} color="#0D9488" />
              </View>
              <Text style={styles.photoButtonText}>Gallery</Text>
              <Text style={styles.photoButtonSub}>Upload file</Text>
            </TouchableOpacity>
          </View>

          {/* Active Preview */}
          <View style={styles.activePhotoPreview}>
            <Image source={selectedPlant.image} style={styles.previewThumb} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.previewName}>{selectedPlant.name} ({selectedPlant.hindiName})</Text>
              <Text style={styles.previewSub}>✓ Photo ready · GPS: Pune rural bunds</Text>
            </View>
            <TouchableOpacity
              onPress={() => setAiScanModalVisible(true)}
              style={styles.scanAgainBtn}
            >
              <Ionicons name="scan" size={14} color={COLORS.primary} />
              <Text style={styles.scanAgainText}>Scan AI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Select Plant Type */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🌿 Select Plant Type</Text>
          </View>

          <View style={styles.plantGrid}>
            {plantTypes.map((plant) => {
              const isSelected = selectedPlant.id === plant.id;
              return (
                <TouchableOpacity
                  key={plant.id}
                  style={[
                    styles.plantGridItem,
                    isSelected && styles.plantGridItemSelected,
                  ]}
                  onPress={() => handleSelectPlant(plant)}
                  activeOpacity={0.8}
                >
                  <Image source={plant.image} style={styles.plantGridThumb} />
                  <Text
                    style={[
                      styles.plantGridName,
                      isSelected && styles.plantGridNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {plant.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Card 3: Listing Details Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📋 Listing Details</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Quantity Available (kg)</Text>
            <TextInput
              style={styles.inputBox}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="e.g. 10"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Price per kg (₹)</Text>
            <TextInput
              style={styles.inputBox}
              value={pricePerKg}
              onChangeText={setPricePerKg}
              keyboardType="numeric"
              placeholder="e.g. 120"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Harvest Date</Text>
            <TextInput
              style={styles.inputBox}
              value={harvestDate}
              onChangeText={setHarvestDate}
              placeholder="e.g. Today, 12 Oct 2026"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
            activeOpacity={0.88}
          >
            <Ionicons name="cloud-upload" size={18} color={COLORS.white} />
            <Text style={styles.publishButtonText}>
              Publish Listing & Generate QR Label
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.draftButton}
            onPress={handleSaveDraft}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={16} color={COLORS.primary} />
            <Text style={styles.draftButtonText}>Save as Offline Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* AI Leaf Scanner Modal */}
      <AiScanModal onDetected={handleAiDetected} />
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIconBox: {
    marginBottom: 6,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  photoButtonSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activePhotoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  previewName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  previewSub: {
    fontSize: 10,
    color: '#15803D',
    marginTop: 2,
    fontWeight: '500',
  },
  scanAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scanAgainText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  plantGridItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  plantGridItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
  },
  plantGridThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginBottom: 6,
  },
  plantGridName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  plantGridNameSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    ...SHADOWS.raised,
  },
  publishButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  draftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 16,
  },
  draftButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

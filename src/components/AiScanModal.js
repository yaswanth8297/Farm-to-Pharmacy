import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { INITIAL_PLANTS } from '../constants/plantData';

export default function AiScanModal({ onDetected }) {
  const { aiScanModalVisible, setAiScanModalVisible, showToast } = useApp();

  const [scanning, setScanning] = useState(false);
  const [detectedPlant, setDetectedPlant] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  // Animated laser scan line
  const [scanAnim] = useState(new Animated.Value(0));

  const sampleSpecies = [
    { ...INITIAL_PLANTS[0], conf: 96.4, family: 'Lamiaceae' }, // Tulsi
    { ...INITIAL_PLANTS[2], conf: 93.8, family: 'Meliaceae' }, // Neem
    { ...INITIAL_PLANTS[3], conf: 95.1, family: 'Zingiberaceae' }, // Turmeric
    { ...INITIAL_PLANTS[6], conf: 92.4, family: 'Solanaceae' }, // Ashwagandha
    { ...INITIAL_PLANTS[1], conf: 89.2, family: 'Asphodelaceae' }, // Aloe Vera
    { ...INITIAL_PLANTS[5], conf: 94.0, family: 'Lamiaceae' }, // Mint
  ];

  const currentSample = sampleSpecies[selectedSampleIndex];

  useEffect(() => {
    if (aiScanModalVisible) {
      setDetectedPlant(null);
      setScanning(true);

      // Start animated laser loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate CNN inference < 1.8s
      const timer = setTimeout(() => {
        setScanning(false);
        setDetectedPlant(currentSample);
        setConfidence(currentSample.conf);
        showToast(`✓ AI Match: ${currentSample.name} (${currentSample.conf}% confidence)`);
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [aiScanModalVisible, selectedSampleIndex]);

  const handleApply = () => {
    if (onDetected && detectedPlant) {
      onDetected(detectedPlant);
    }
    setAiScanModalVisible(false);
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170],
  });

  return (
    <Modal
      visible={aiScanModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setAiScanModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
              <Text style={styles.title}>AI Medicinal Leaf Scanner</Text>
            </View>
            <TouchableOpacity
              onPress={() => setAiScanModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Camera Viewfinder */}
          <View style={styles.viewfinder}>
            <Image source={currentSample.image} style={styles.leafImage} />

            {/* Viewfinder crosshairs */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            {/* Laser scanning bar */}
            {scanning && (
              <Animated.View
                style={[
                  styles.laserLine,
                  { transform: [{ translateY }] },
                ]}
              />
            )}

            {scanning && (
              <View style={styles.scanningBadge}>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={styles.scanningText}>CNN Inferencing (1.18s)...</Text>
              </View>
            )}
          </View>

          {/* Sample Selector */}
          <View style={styles.sampleSwitchRow}>
            <Text style={styles.sampleSwitchLabel}>Test Field Photos:</Text>
            <View style={styles.sampleButtons}>
              {sampleSpecies.map((s, idx) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.sampleBtn,
                    selectedSampleIndex === idx && styles.sampleBtnActive,
                  ]}
                  onPress={() => setSelectedSampleIndex(idx)}
                >
                  <Text
                    style={[
                      styles.sampleBtnText,
                      selectedSampleIndex === idx && styles.sampleBtnTextActive,
                    ]}
                  >
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* AI Recognition Dossier */}
          {detectedPlant && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultSpecies}>{detectedPlant.name} ({detectedPlant.hindiName})</Text>
                  <Text style={styles.resultScientific}>{detectedPlant.scientificName}</Text>
                </View>
                <View style={styles.confBadge}>
                  <Text style={styles.confText}>{confidence}% Match</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Market Price:</Text>
                <Text style={styles.dossierValueGreen}>₹{detectedPlant.price} / kg</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Active Phytochemicals:</Text>
                <Text style={styles.dossierValue}>{detectedPlant.activeCompounds?.slice(0, 3).join(', ')}</Text>
              </View>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Indications:</Text>
                <Text style={styles.dossierValue}>{detectedPlant.medicinalBenefits}</Text>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                <Text style={styles.applyButtonText}>Use In Listing Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: '100%',
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.85,
  },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4ADE80',
  },
  cornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4ADE80',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4ADE80',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4ADE80',
  },
  laserLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: '#22C55E',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  scanningBadge: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scanningText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  sampleSwitchRow: {
    marginTop: 12,
    marginBottom: 6,
  },
  sampleSwitchLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 6,
  },
  sampleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sampleBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  sampleBtnText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sampleBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultSpecies: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resultScientific: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  confBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  confText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  dossierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  dossierLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dossierValue: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  dossierValueGreen: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

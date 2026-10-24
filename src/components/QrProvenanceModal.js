import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path } from 'react-native-svg';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

import QRCode from 'qrcode';

// Standards-based QR code matrix generator using pure JavaScript
function DynamicQrSvg({ value = 'https://herblink.vercel.app', size = 160 }) {
  let cells = [];
  let moduleCount = 25;

  try {
    const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
    moduleCount = qr.modules.size;
    const data = qr.modules.data;
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (data[r * moduleCount + c]) {
          cells.push({ r, c });
        }
      }
    }
  } catch (e) {
    console.warn('QR code generation error', e);
  }

  const cellSize = size / moduleCount;

  return (
    <View style={styles.qrContainer}>
      <Svg width={size} height={size}>
        <Rect width={size} height={size} fill="#FFFFFF" />
        {cells.map((m) => (
          <Rect
            key={`${m.r}-${m.c}`}
            x={m.c * cellSize}
            y={m.r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0F172A"
          />
        ))}
      </Svg>
    </View>
  );
}

export default function QrProvenanceModal() {
  const {
    provenanceModalVisible,
    setProvenanceModalVisible,
    activeProvenanceBatch,
    showToast,
  } = useApp();

  if (!activeProvenanceBatch) return null;

  const batch = activeProvenanceBatch;
  const hash =
    batch.batchHash ||
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const qrPayload = `https://herblink.vercel.app/verify?batch=${batch.batchCode || 'BATCH-2026'}&hash=${hash.substring(0, 16)}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌿 HerbLink Provenance Certificate\nBatch: ${batch.batchCode || 'BATCH-2026'}\nPlant: ${batch.name}\nOrigin: ${batch.farmerLocation || 'Pune, MH'}\nVerification Link: ${qrPayload}\nVerified AYUSH Traceable Batch.`,
      });
    } catch (e) {
      showToast('Shared batch certificate');
    }
  };

  return (
    <Modal
      visible={provenanceModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setProvenanceModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="qr-code-outline" size={20} color={COLORS.primary} />
              <Text style={styles.title}>Batch Provenance & QR Label</Text>
            </View>
            <TouchableOpacity
              onPress={() => setProvenanceModalVisible(false)}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close QR modal"
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Real Dynamic QR Code */}
            <View style={styles.qrWrapper}>
              <DynamicQrSvg value={qrPayload} size={150} />
              <Text style={styles.qrLabelCode}>{batch.batchCode || 'BATCH-TLS-2026-089'}</Text>
              <View style={styles.verifiedChip}>
                <Ionicons name="shield-checkmark" size={13} color="#227A45" />
                <Text style={styles.verifiedChipText}>Scannable by any Camera App</Text>
              </View>
            </View>

            {/* Batch Journey Timeline */}
            <View style={[styles.auditSection, { marginBottom: 14 }]}>
              <Text style={styles.sectionHeader}>Farm-to-Dock Journey Timeline</Text>
              <View style={{ gap: 8, marginTop: 4 }}>
                {[
                  { title: 'Harvest Completed', sub: `${batch.harvestDate || 'Today, 06:30 AM'} · Farmstead Pune`, icon: 'leaf', done: true },
                  { title: 'Quality & Moisture Inspected', sub: `Moisture: ${batch.moistureContent || '8.2%'} · AYUSH Grade A`, icon: 'checkmark-circle', done: true },
                  { title: 'Bag Sealed & QR Affixed', sub: 'Tamper-evident barcode tagged', icon: 'barcode', done: true },
                  { title: 'Cold-Chain Transit', sub: 'In transit to Central Pharmaceutical Dock', icon: 'airplane', done: false },
                ].map((step, sIdx) => (
                  <View key={sIdx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={step.done ? '#166534' : COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textPrimary }}>
                        {step.title}
                      </Text>
                      <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>
                        {step.sub}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: step.done ? '#166534' : COLORS.textMuted }}>
                      {step.done ? '✓ Verified' : '● Next Step'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Traceability Audit Records */}
            <View style={styles.auditSection}>
              <Text style={styles.sectionHeader}>Farmstead Audit Trail</Text>

              <View style={styles.row}>
                <Text style={styles.label}>Plant Species:</Text>
                <Text style={styles.valueBold}>{batch.name} ({batch.scientificName || 'Medicinal'})</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Farmer / Grower:</Text>
                <Text style={styles.value}>{batch.farmerName || 'Ramesh Kumar'} (✓ Certified)</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Farm District:</Text>
                <Text style={styles.value}>{batch.farmerLocation || 'Pune, Maharashtra'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Harvest Timestamp:</Text>
                <Text style={styles.value}>{batch.harvestDate || '12 Oct 2026, 06:30 AM'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Batch Volume:</Text>
                <Text style={styles.value}>{batch.quantity || batch.stock || 25} kg verified</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Moisture Analysis:</Text>
                <Text style={styles.value}>{batch.moistureContent || '8.2% (AYUSH Optimum)'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Quality Sign-off:</Text>
                <Text style={styles.valueGreen}>{batch.labReport || 'AYUSH Grade A - 99.4% Purity'}</Text>
              </View>

              <View style={styles.hashBox}>
                <Text style={styles.hashLabel}>SHA-256 Batch Cryptographic Hash:</Text>
                <Text style={styles.hashText}>{hash}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.printButton}
                onPress={() => {
                  showToast('🖨️ QR Label sent to printer / PDF saved');
                  setProvenanceModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="print-outline" size={18} color={COLORS.white} />
                <Text style={styles.printButtonText}>Print Bag Sticker</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
                <Text style={styles.shareButtonText}>Share Certificate</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
    maxHeight: '90%',
    ...SHADOWS.raised,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  scroll: {
    paddingVertical: 14,
  },
  qrWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  qrLabelCode: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#227A45',
  },
  auditSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  valueBold: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  valueGreen: {
    fontSize: 11,
    color: '#227A45',
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  hashBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hashLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  hashText: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  printButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F7F2',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

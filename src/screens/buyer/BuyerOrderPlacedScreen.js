import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function BuyerOrderPlacedScreen() {
  const { lastPlacedOrder, setCurrentScreen, showToast } = useApp();
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Fallback realistic order data if opened directly
  const total = lastPlacedOrder?.totalPrice || 35700;
  const subtotal = lastPlacedOrder?.subtotal || Math.round(total / 1.05);
  const gst = lastPlacedOrder?.gst || Math.round(subtotal * 0.05);
  const orderNum = lastPlacedOrder?.orderNumber || '#ORD-2026-8942';
  const txnId = lastPlacedOrder?.transactionId || 'TXN-AYUSH-9842104';
  const deliveryOtp = lastPlacedOrder?.deliveryOtp || '4892';
  const paymentMethod = lastPlacedOrder?.paymentMethod || 'UPI / Instant Bank Settlement';
  const receiptNum = lastPlacedOrder?.receiptNumber || 'REC-GST-894210';
  const createdAt =
    lastPlacedOrder?.createdAt ||
    new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  const timestamp =
    lastPlacedOrder?.timestamp ||
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const items =
    lastPlacedOrder?.items && lastPlacedOrder.items.length > 0
      ? lastPlacedOrder.items
      : [
          {
            plant: {
              name: 'Ashwagandha Roots',
              scientificName: 'Withania somnifera',
              farmerName: 'Ramesh Patel (FPO Gujarat)',
              batchCode: 'AYUSH-ASH-9821',
              price: 420,
            },
            quantity: 50,
          },
          {
            plant: {
              name: 'Shatavari Extract Grade A',
              scientificName: 'Asparagus racemosus',
              farmerName: 'Kaveri Herbal Farms',
              batchCode: 'AYUSH-SHT-4412',
              price: 650,
            },
            quantity: 20,
          },
        ];

  const handleCopyTxn = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(txnId);
      }
      setCopiedTxn(true);
      showToast('✓ Transaction ID copied to clipboard');
      setTimeout(() => setCopiedTxn(false), 2500);
    } catch {
      showToast(`✓ Transaction ID: ${txnId}`);
    }
  };

  const handleDownloadInvoice = () => {
    showToast(`📄 Tax Invoice ${receiptNum} downloaded & sent to registered email`);
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar backgroundColor="#EDF5EE" dark />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.secureDot} />
          <Text style={styles.topBarTag}>AYUSH Certified B2B Settlement</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setCurrentScreen('home')}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Ionicons name="close" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          {/* Hero: Payment Successful Card */}
          <View style={styles.heroPaymentCard}>
            {/* Glowing Success Badge */}
            <View style={styles.checkGlowRing}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark-done" size={46} color={COLORS.white} />
              </View>
            </View>

            {/* Payment Success Headings */}
            <View style={styles.paymentSuccessPill}>
              <Ionicons name="shield-checkmark" size={14} color="#15803D" style={{ marginRight: 5 }} />
              <Text style={styles.paymentSuccessPillText}>PAYMENT SUCCESSFUL</Text>
            </View>

            <Text style={styles.heroTitle}>Payment Successful!</Text>
            <Text style={styles.heroSubtitle}>
              Order confirmed and locked on AYUSH smart provenance ledger
            </Text>

            {/* Amount Paid Callout */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total Amount Paid</Text>
              <Text style={styles.amountValue}>₹{total.toLocaleString('en-IN')}</Text>
              <View style={styles.settlementRow}>
                <Ionicons name="flash" size={13} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={styles.settlementText}>
                  Instant Settlement via {paymentMethod.split('/')[0].trim()}
                </Text>
              </View>
            </View>
          </View>

          {/* Official Payment Receipt & Transaction Info Card */}
          <View style={styles.receiptCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="receipt-outline" size={18} color="#15803D" style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Payment Receipt & Tax Details</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadInvoiceBtn}
                onPress={handleDownloadInvoice}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={14} color="#15803D" style={{ marginRight: 4 }} />
                <Text style={styles.downloadInvoiceText}>Invoice</Text>
              </TouchableOpacity>
            </View>

            {/* Transaction Ref Row */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Transaction Reference</Text>
              <TouchableOpacity
                style={styles.copyPill}
                onPress={handleCopyTxn}
                activeOpacity={0.7}
              >
                <Text style={styles.txnIdText}>{txnId}</Text>
                <Ionicons
                  name={copiedTxn ? 'checkmark-circle' : 'copy-outline'}
                  size={14}
                  color={copiedTxn ? '#15803D' : '#64748B'}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>

            {/* Order Number Row */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Order Reference ID</Text>
              <Text style={styles.receiptBoldValue}>{orderNum}</Text>
            </View>

            {/* Payment Method */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Payment Method</Text>
              <Text style={styles.receiptValue}>{paymentMethod}</Text>
            </View>

            {/* Payment Status */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Payment Status</Text>
              <View style={styles.paidStatusBadge}>
                <Ionicons name="checkmark-circle" size={13} color="#166534" style={{ marginRight: 4 }} />
                <Text style={styles.paidStatusText}>Paid & Verified</Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Payment Date & Time</Text>
              <Text style={styles.receiptValue}>
                {createdAt} · {timestamp}
              </Text>
            </View>

            {/* GSTIN & Tax Clearance */}
            <View style={styles.receiptDetailRow}>
              <Text style={styles.receiptLabel}>Tax Slab (GST 5%)</Text>
              <Text style={styles.receiptValue}>₹{gst.toLocaleString('en-IN')} (Cleared)</Text>
            </View>
          </View>

          {/* Dock Delivery OTP Card */}
          <View style={styles.otpCard}>
            <View style={styles.otpHeaderRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={styles.otpTag}>
                  <Ionicons name="key-outline" size={12} color="#92400E" style={{ marginRight: 4 }} />
                  <Text style={styles.otpTagText}>MANDATORY AT DOCK</Text>
                </View>
                <Text style={styles.otpTitle}>Secure B2B Receiving OTP</Text>
                <Text style={styles.otpSub}>
                  Share this 4-digit security code with the cold-chain driver upon dock inspection
                </Text>
              </View>
              <View style={styles.otpBadgeContainer}>
                <Text style={styles.otpCode}>{deliveryOtp}</Text>
                <Text style={styles.otpSubtext}>Dock PIN</Text>
              </View>
            </View>
          </View>

          {/* Procured Herb Batches Card */}
          <View style={styles.itemsCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="leaf-outline" size={18} color="#166534" style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Procured Herb Batches ({items.length})</Text>
              </View>
              <View style={styles.provenancePill}>
                <Ionicons name="shield-checkmark" size={12} color="#15803D" style={{ marginRight: 4 }} />
                <Text style={styles.provenancePillText}>Lab Certified</Text>
              </View>
            </View>

            {items.map((it, idx) => {
              const plantName = it.plant?.name || 'Medicinal Herb';
              const sciName = it.plant?.scientificName || 'Botanical extract';
              const qty = it.quantity || 1;
              const unitPrice = it.plant?.price || 0;
              const farmer = it.plant?.farmerName || 'Verified AYUSH Grower';
              const batch = it.plant?.batchCode || `AYUSH-2026-${idx + 1}`;
              const lineTotal = unitPrice * qty;

              return (
                <View key={idx} style={styles.itemCardRow}>
                  <View style={styles.itemIconBox}>
                    <Ionicons name="leaf" size={18} color="#2E7D32" />
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={styles.itemNameText}>{plantName}</Text>
                    <Text style={styles.itemSciName}>{sciName}</Text>
                    <Text style={styles.itemMetaText}>
                      {farmer} · Batch #{batch}
                    </Text>
                    <Text style={styles.itemQtyText}>
                      {qty} kg @ ₹{unitPrice}/kg
                    </Text>
                  </View>
                  <Text style={styles.itemPriceText}>
                    ₹{lineTotal.toLocaleString('en-IN')}
                  </Text>
                </View>
              );
            })}

            <View style={styles.cardDivider} />

            {/* Financial Breakdown */}
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Herb Batches Subtotal</Text>
              <Text style={styles.calcValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>AYUSH Quality Certification & Assay</Text>
              <Text style={styles.freeGreenText}>FREE (Govt. Subsidized)</Text>
            </View>

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Cold-Chain Refrigerated Transit</Text>
              <Text style={styles.freeGreenText}>FREE</Text>
            </View>

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Medicinal Plant GST (5%)</Text>
              <Text style={styles.calcValue}>₹{gst.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Paid (Settled)</Text>
              <Text style={styles.grandTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Transit & Tracking Callout */}
          <View style={styles.transitBox}>
            <View style={styles.transitIconCircle}>
              <Ionicons name="snow-outline" size={22} color="#0D9488" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.transitHeading}>Cold-Chain Dispatch Initiated</Text>
              <Text style={styles.transitDesc}>
                Direct Farm Gate ➔ Pharma Lab Receiving Dock. Active temperature monitoring (2°C–8°C) with real-time GPS telemetry.
              </Text>
              <View style={styles.transitEtaBadge}>
                <Ionicons name="time-outline" size={13} color="#0F766E" style={{ marginRight: 5 }} />
                <Text style={styles.transitEtaText}>Estimated Dock Delivery: 24–48 Hours</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setCurrentScreen('orders')}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Track Live Order"
            >
              <Ionicons name="navigate-circle-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Track Live in Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setCurrentScreen('browse')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue Procuring"
            >
              <Ionicons name="bag-add-outline" size={19} color="#1E5E28" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Continue Procuring Herbs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.invoiceOutlineBtn}
              onPress={handleDownloadInvoice}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Download Tax Invoice"
            >
              <Ionicons name="document-text-outline" size={18} color="#475569" style={{ marginRight: 8 }} />
              <Text style={styles.invoiceOutlineText}>Download Tax Invoice & Quality CoA (PDF)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#EDF5EE',
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EDF5EE',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 125, 50, 0.1)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 8,
  },
  topBarTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5E28',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },

  // Hero: Payment Successful Card
  heroPaymentCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    ...SHADOWS.card,
  },
  checkGlowRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.raised,
  },
  paymentSuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  paymentSuccessPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F5132',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 440,
  },
  amountBox: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#14532D',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  settlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settlementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },

  // Receipt Card
  receiptCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  downloadInvoiceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  receiptDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  receiptLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txnIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    fontFamily: 'monospace',
  },
  receiptBoldValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  paidStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  paidStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },

  // OTP Card
  otpCard: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...SHADOWS.card,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  otpTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.8,
  },
  otpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 4,
  },
  otpSub: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  otpBadgeContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  otpCode: {
    fontSize: 22,
    fontWeight: '900',
    color: '#78350F',
    letterSpacing: 3,
  },
  otpSubtext: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // Items Card
  itemsCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  provenancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  provenancePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  itemCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  itemSciName: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 1,
  },
  itemMetaText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  itemQtyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    marginTop: 2,
  },
  itemPriceText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  calcLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  freeGreenText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#166534',
  },

  // Transit Box
  transitBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    marginBottom: 24,
  },
  transitIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transitHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 3,
  },
  transitDesc: {
    fontSize: 11,
    color: '#115E59',
    lineHeight: 16,
    marginBottom: 6,
  },
  transitEtaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transitEtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },

  // Action Buttons
  actionButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E5E28',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.raised,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#1E5E28',
    fontSize: 14,
    fontWeight: '800',
  },
  invoiceOutlineBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceOutlineText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
});

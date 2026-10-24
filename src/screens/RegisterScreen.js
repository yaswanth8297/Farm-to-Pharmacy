import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import AndroidStatusBar from '../components/AndroidStatusBar';

export default function RegisterScreen() {
  const { register, setCurrentScreen } = useApp();

  // Mode: 'farmer' or 'buyer' (pharmacy)
  const [mode, setMode] = useState('farmer');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Role-Specific Fields
  // Farmer fields
  const [location, setLocation] = useState('Pune District, Maharashtra');
  const [acreage, setAcreage] = useState('5 Acres');
  const [primaryCrops, setPrimaryCrops] = useState('Tulsi, Neem, Aloe Vera');
  const [isOrganic, setIsOrganic] = useState(true);

  // Pharmacy fields
  const [companyName, setCompanyName] = useState('');
  const [ayushLicense, setAyushLicense] = useState('AYUSH-MH-2026-9921');
  const [gstin, setGstin] = useState('27AABCU9603R1ZX');
  const [procurementCapacity, setProcurementCapacity] = useState('500 - 2,000 kg / month');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'buyer' && !companyName.trim()) {
      setError('Please enter your Pharmacy or Company name');
      return;
    }

    setLoading(true);
    setError('');

    const additionalInfo = mode === 'farmer'
      ? {
          location: location.trim(),
          farmAcreage: acreage.trim(),
          primaryCrops: primaryCrops.trim(),
          isOrganic,
        }
      : {
          company: companyName.trim(),
          ayushLicense: ayushLicense.trim(),
          gstin: gstin.trim(),
          procurementCapacity: procurementCapacity.trim(),
        };

    const res = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 43210',
      password,
      role: mode,
      additionalInfo,
    });

    if (!res.ok) {
      setError(res.error || 'Registration failed');
      setLoading(false);
    }
  };

  const isFarmer = mode === 'farmer';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AndroidStatusBar dark backgroundColor="#EDF5EE" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Row */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setCurrentScreen('home')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Back to sign in"
          >
            <Ionicons name="arrow-back" size={20} color="#1E5E28" />
            <Text style={styles.backBtnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.headerBox}>
          <View style={styles.logoRow}>
            <View style={styles.logoThumb}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImg}
              />
            </View>
            <View>
              <Text style={styles.appTitle}>Farm To Pharmacy</Text>
              <Text style={styles.appTagline}>Direct B2B Botanical Trade</Text>
            </View>
          </View>
          <Text style={styles.pageTitle}>Create New Account</Text>
          <Text style={styles.pageSubtitle}>
            Join India's verified AYUSH medicinal plant supply chain network.
          </Text>
        </View>

        {/* ================================================================ */}
        {/* MODE SELECTOR: Farmer vs Pharmacy */}
        {/* ================================================================ */}
        <View style={styles.modeSection}>
          <Text style={styles.modeSectionLabel}>
            CHOOSE REGISTRATION MODE
          </Text>

          <View style={styles.modeCardGrid}>
            {/* Farmer Mode Card */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                isFarmer && styles.modeCardActiveFarmer,
              ]}
              onPress={() => {
                setMode('farmer');
                setError('');
              }}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel="Register as Medicinal Farmer"
              accessibilityState={{ selected: isFarmer }}
            >
              <View style={styles.modeTopRow}>
                <View style={[styles.modeIconCircle, { backgroundColor: isFarmer ? '#DCFCE7' : '#F1F5F9' }]}>
                  <Ionicons
                    name="leaf"
                    size={22}
                    color={isFarmer ? '#15803D' : '#64748B'}
                  />
                </View>
                <View style={[styles.radioCircle, isFarmer && styles.radioCircleActiveFarmer]}>
                  {isFarmer && <View style={styles.radioDotFarmer} />}
                </View>
              </View>

              <Text style={[styles.modeTitle, isFarmer && styles.modeTitleActiveFarmer]}>
                Medicinal Farmer
              </Text>
              <Text style={styles.modeRoleSubtitle}>Cultivator & Gatherer</Text>

              <Text style={styles.modeDesc}>
                List harvests, check AI botanical value, and receive instant escrow payouts.
              </Text>

              <View style={[styles.modeBadge, isFarmer && styles.modeBadgeActiveFarmer]}>
                <Ionicons name="cash-outline" size={12} color={isFarmer ? '#15803D' : '#64748B'} />
                <Text style={[styles.modeBadgeText, isFarmer && styles.modeBadgeTextActiveFarmer]}>
                  0% Broker Cuts · Direct Trade
                </Text>
              </View>
            </TouchableOpacity>

            {/* Pharmacy Mode Card */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                !isFarmer && styles.modeCardActivePharmacy,
              ]}
              onPress={() => {
                setMode('buyer');
                setError('');
              }}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel="Register as Pharmacy or Ayurvedic Manufacturer"
              accessibilityState={{ selected: !isFarmer }}
            >
              <View style={styles.modeTopRow}>
                <View style={[styles.modeIconCircle, { backgroundColor: !isFarmer ? '#CCFBF1' : '#F1F5F9' }]}>
                  <Ionicons
                    name="medkit"
                    size={22}
                    color={!isFarmer ? '#0F766E' : '#64748B'}
                  />
                </View>
                <View style={[styles.radioCircle, !isFarmer && styles.radioCircleActivePharmacy]}>
                  {!isFarmer && <View style={styles.radioDotPharmacy} />}
                </View>
              </View>

              <Text style={[styles.modeTitle, !isFarmer && styles.modeTitleActivePharmacy]}>
                Ayurvedic Pharmacy
              </Text>
              <Text style={styles.modeRoleSubtitle}>Pharma Buyer / Lab</Text>

              <Text style={styles.modeDesc}>
                Source raw herbs with tamper-proof QR provenance and lab moisture assays.
              </Text>

              <View style={[styles.modeBadge, !isFarmer && styles.modeBadgeActivePharmacy]}>
                <Ionicons name="shield-checkmark" size={12} color={!isFarmer ? '#0F766E' : '#64748B'} />
                <Text style={[styles.modeBadgeText, !isFarmer && styles.modeBadgeTextActivePharmacy]}>
                  AYUSH Certified · GST Invoices
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================ */}
        {/* REGISTRATION FORM CARD */}
        {/* ================================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardHeaderPill, { backgroundColor: isFarmer ? '#DCFCE7' : '#CCFBF1' }]}>
              <Ionicons
                name={isFarmer ? 'leaf' : 'business'}
                size={14}
                color={isFarmer ? '#15803D' : '#0F766E'}
              />
              <Text style={[styles.cardHeaderPillText, { color: isFarmer ? '#15803D' : '#0F766E' }]}>
                {isFarmer ? 'Farmer Registration Details' : 'Pharmacy Procurement Details'}
              </Text>
            </View>
          </View>

          {/* Full Name */}
          <Text style={styles.label}>
            {isFarmer ? 'Cultivator Full Name *' : 'Procurement Officer Name *'}
          </Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError('');
              }}
              placeholder={isFarmer ? 'e.g. Ramesh Kumar' : 'e.g. Dr. Priya Sharma'}
              placeholderTextColor={COLORS.textMuted}
              accessibilityLabel="Full Name Input"
            />
          </View>

          {/* Mode-Specific Field: Pharmacy Company Name */}
          {!isFarmer && (
            <>
              <Text style={[styles.label, { marginTop: 14 }]}>
                Pharmacy / Company Name *
              </Text>
              <View style={styles.inputRow}>
                <Ionicons name="business-outline" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  value={companyName}
                  onChangeText={(t) => {
                    setCompanyName(t);
                    setError('');
                  }}
                  placeholder="e.g. City Ayurvedic Pharmaceuticals Ltd"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="Company Name Input"
                />
              </View>
            </>
          )}

          {/* Email Address */}
          <Text style={[styles.label, { marginTop: 14 }]}>Email Address *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              placeholder={isFarmer ? 'farmer@herblink.demo' : 'pharma@herblink.demo'}
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Email Address Input"
            />
          </View>

          {/* Phone Number */}
          <Text style={[styles.label, { marginTop: 14 }]}>Mobile Number *</Text>
          <View style={styles.inputRow}>
            <View style={styles.prefixBox}>
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setError('');
              }}
              placeholder="98765 43210"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              accessibilityLabel="Mobile Number Input"
            />
          </View>

          {/* Mode-Specific Field: Farmer Land & Location */}
          {isFarmer ? (
            <>
              <Text style={[styles.label, { marginTop: 14 }]}>Farm Location / District</Text>
              <View style={styles.inputRow}>
                <Ionicons name="location-outline" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="District, State"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="Farm Location Input"
                />
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>Total Land Acreage</Text>
              <View style={styles.inputRow}>
                <Ionicons name="globe-outline" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  value={acreage}
                  onChangeText={setAcreage}
                  placeholder="e.g. 5 Acres"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="Acreage Input"
                />
              </View>

              {/* Organic Certified Toggle */}
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsOrganic(!isOrganic)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isOrganic ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={isOrganic ? '#15803D' : COLORS.textMuted}
                />
                <Text style={styles.toggleLabel}>
                  Cultivating Organic & Pesticide-Free Medicinal Crops
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Pharmacy: AYUSH License & GSTIN */}
              <Text style={[styles.label, { marginTop: 14 }]}>AYUSH Manufacturing License *</Text>
              <View style={styles.inputRow}>
                <Ionicons name="ribbon-outline" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  value={ayushLicense}
                  onChangeText={setAyushLicense}
                  placeholder="AYUSH-XX-YYYY-ZZZZ"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="AYUSH License Input"
                />
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>Corporate GSTIN</Text>
              <View style={styles.inputRow}>
                <Ionicons name="receipt-outline" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  value={gstin}
                  onChangeText={setGstin}
                  placeholder="27AABCU9603R1ZX"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="characters"
                  accessibilityLabel="GSTIN Input"
                />
              </View>
            </>
          )}

          {/* Password */}
          <Text style={[styles.label, { marginTop: 14 }]}>Password *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError('');
              }}
              placeholder="Create password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel="Password Input"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.label, { marginTop: 14 }]}>Confirm Password *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="shield-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setError('');
              }}
              placeholder="Re-type password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel="Confirm Password Input"
            />
          </View>

          {/* Error Message */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.status.cancelled.text} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit Registration Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              isFarmer ? styles.submitBtnFarmer : styles.submitBtnPharmacy,
              loading && styles.submitBtnDisabled,
            ]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`Register as ${isFarmer ? 'Farmer' : 'Pharmacy'}`}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>
                  {isFarmer ? 'Register as Medicinal Farmer 🌿' : 'Register as Ayurvedic Pharmacy 🏥'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* Already have an account prompt */}
          <View style={styles.signInPromptRow}>
            <Text style={styles.promptText}>Already registered on Farm To Pharmacy? </Text>
            <TouchableOpacity
              onPress={() => setCurrentScreen('home')}
              accessibilityRole="button"
              accessibilityLabel="Go to Sign In"
            >
              <Text style={styles.promptLink}>Sign In Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Regulatory Footnote */}
        <View style={styles.trustBanner}>
          <Ionicons name="shield-checkmark" size={14} color="#166534" />
          <Text style={styles.trustBannerText}>
            AYUSH Quality Control Standard · 256-Bit Encrypted B2B Authentication
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5EE',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 94, 40, 0.08)',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5E28',
  },
  headerBox: {
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  logoThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  logoImg: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E5E28',
  },
  appTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B6B50',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  modeSection: {
    marginBottom: 18,
  },
  modeSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modeCardGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  modeCardActiveFarmer: {
    borderColor: '#16A34A',
    backgroundColor: '#F7FEF9',
  },
  modeCardActivePharmacy: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  modeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActiveFarmer: {
    borderColor: '#16A34A',
  },
  radioCircleActivePharmacy: {
    borderColor: '#0D9488',
  },
  radioDotFarmer: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },
  radioDotPharmacy: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D9488',
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  modeTitleActiveFarmer: {
    color: '#15803D',
  },
  modeTitleActivePharmacy: {
    color: '#0F766E',
  },
  modeRoleSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  modeDesc: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 14,
    marginBottom: 8,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modeBadgeActiveFarmer: {
    backgroundColor: '#DCFCE7',
  },
  modeBadgeActivePharmacy: {
    backgroundColor: '#CCFBF1',
  },
  modeBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modeBadgeTextActiveFarmer: {
    color: '#15803D',
  },
  modeBadgeTextActivePharmacy: {
    color: '#0F766E',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    marginBottom: 14,
  },
  cardHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  cardHeaderPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMain,
    padding: 0,
    margin: 0,
    outlineStyle: 'none',
  },
  prefixBox: {
    paddingRight: 6,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  prefixText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.cancelled.bg,
    padding: 10,
    borderRadius: 10,
    marginTop: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.status.cancelled.text,
    flex: 1,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    ...SHADOWS.raised,
  },
  submitBtnFarmer: {
    backgroundColor: '#15803D',
  },
  submitBtnPharmacy: {
    backgroundColor: '#0F766E',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  signInPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  promptText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  promptLink: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 10,
  },
  trustBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
});

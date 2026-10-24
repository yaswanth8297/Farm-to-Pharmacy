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
import { DEMO_ACCOUNTS, DEFAULT_ACCOUNT } from '../constants/demoAccounts';
import AndroidStatusBar from '../components/AndroidStatusBar';

export default function LoginScreen() {
  const { login } = useApp();

  // Default login details pre-filled for easy demo presentation
  const [email, setEmail] = useState(DEFAULT_ACCOUNT.email);
  const [password, setPassword] = useState(DEFAULT_ACCOUNT.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const handleSignIn = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error || 'Authentication failed');
      setLoading(false);
    }
  };

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
        {/* Brand Header */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImg}
            />
          </View>
          <Text style={styles.appTitle}>Farm To Pharmacy</Text>
          <Text style={styles.appSubtitle}>
            Direct Botanical Trade · B2B Herb Marketplace
          </Text>
          <View style={styles.specBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#166534" />
            <Text style={styles.specBadgeText}>AYUSH Compliant Verification</Text>
          </View>
        </View>

        {/* Credentials Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Sign In to Account</Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              accessibilityLabel="Email Address Input"
            />
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError('');
              }}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              onSubmitEditing={handleSignIn}
              accessibilityLabel="Password Input"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Inline Error Message */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.status.cancelled.text} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Sign In CTA */}
          <TouchableOpacity
            style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
            onPress={handleSignIn}
            activeOpacity={0.85}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in button"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.signInText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Account Quick Switcher */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeaderRow}>
            <Ionicons name="flash" size={15} color={COLORS.goldDark} />
            <Text style={styles.demoTitle}>One-Tap Demo Accounts</Text>
          </View>
          <Text style={styles.demoSub}>
            Tap any role to immediately populate demo credentials:
          </Text>

          {DEMO_ACCOUNTS.map((account) => {
            const isFarmer = account.role === 'farmer';
            const isSelected = email.toLowerCase() === account.email.toLowerCase();

            return (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.demoRow,
                  isSelected && styles.demoRowSelected,
                ]}
                onPress={() => fillAccount(account)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Select ${account.label}`}
              >
                <View
                  style={[
                    styles.roleIconBox,
                    { backgroundColor: isFarmer ? '#DCFCE7' : '#CCFBF1' },
                  ]}
                >
                  <Ionicons
                    name={isFarmer ? 'leaf' : 'medkit'}
                    size={18}
                    color={isFarmer ? '#166534' : '#0D9488'}
                  />
                </View>

                <View style={styles.demoTextCol}>
                  <View style={styles.roleTitleRow}>
                    <Text style={styles.demoLabel}>{account.label}</Text>
                    {isSelected && (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>Selected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.demoName}>{account.name} · {account.location}</Text>
                  <Text style={styles.demoCreds}>
                    {account.email} · {account.password}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.footnote}>
          HerbLink Prototype Build · AYUSH Traceability Platform
        </Text>
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
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 28,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.raised,
  },
  logoImg: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E5E28',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#4B6B50',
    marginTop: 3,
    fontWeight: '500',
    textAlign: 'center',
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  specBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.card,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.primarySurface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.status.cancelled.bg,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.status.cancelled.text,
    fontWeight: '600',
  },
  signInBtn: {
    marginTop: 20,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.raised,
  },
  signInBtnDisabled: {
    opacity: 0.7,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  demoBox: {
    marginTop: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.goldDark,
  },
  demoSub: {
    fontSize: 11,
    color: '#92400E',
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  demoRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  roleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoTextCol: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  demoName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  demoCreds: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footnote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#557B5A',
    marginTop: 20,
    fontWeight: '500',
  },
});

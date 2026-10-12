export const COLORS = {
  // Primary brand greens
  primary: '#226E3A',
  primaryDark: '#1B5E20',
  primaryLight: '#E8F5E9',
  primarySurface: '#F1F7F2',
  primaryHeader: '#226E3A',

  // Secondary roles
  pharmaTeal: '#03695D',
  pharmaTealLight: '#E0F2F1',

  // Accent and Rewards
  goldStart: '#F59E0B',
  goldEnd: '#FBBF24',
  goldDark: '#92400E',
  goldCardBg: '#F59E0B',
  goldLight: '#FEF3C7',

  // Neutral Colors
  white: '#FFFFFF',
  background: '#EDF5EE',
  cardBg: '#FFFFFF',
  cardBorder: '#E2ECE4',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  divider: '#E5E7EB',

  // Status badges
  status: {
    live: { text: '#227A45', bg: '#E8F8F0' },
    sold: { text: '#D97706', bg: '#FEF3C7' },
    pending: { text: '#EA580C', bg: '#FFEDD5' },
    processing: { text: '#0284C7', bg: '#E0F2FE' },
    outForDelivery: { text: '#D97706', bg: '#FEF3C7' },
    delivered: { text: '#227A45', bg: '#E8F8F0' },
    cancelled: { text: '#DC2626', bg: '#FEE2E2' },
  },

  // Category & Badge tags
  badges: {
    organic: { text: '#15803D', bg: '#DCFCE7' },
    popular: { text: '#1D4ED8', bg: '#DBEAFE' },
    bestSeller: { text: '#C2410C', bg: '#FFEDD5' },
    premium: { text: '#7E22CE', bg: '#F3E8FF' },
    fresh: { text: '#0F766E', bg: '#CCFBF1' },
  }
};

export const SIZES = {
  radiusSm: 8,
  radiusMd: 14,
  radiusLg: 18,
  radiusXl: 24,
  radiusRound: 999,
  paddingXs: 6,
  paddingSm: 10,
  paddingMd: 16,
  paddingLg: 20,
  paddingXl: 28,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
};

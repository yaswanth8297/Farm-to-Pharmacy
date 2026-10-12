import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function AndroidStatusBar({ dark = false, backgroundColor = COLORS.primary }) {
  return (
    <View style={[styles.statusBarContainer, { backgroundColor }]}>
      <StatusBar
        barStyle={dark ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={styles.statusBarContent}>
        <Text style={[styles.timeText, { color: dark ? COLORS.textPrimary : COLORS.white }]}>
          9:41
        </Text>
        <View style={styles.systemIcons}>
          <Ionicons
            name="cellular"
            size={14}
            color={dark ? COLORS.textPrimary : COLORS.white}
            style={styles.icon}
          />
          <Ionicons
            name="wifi"
            size={14}
            color={dark ? COLORS.textPrimary : COLORS.white}
            style={styles.icon}
          />
          <Ionicons
            name="battery-full"
            size={18}
            color={dark ? COLORS.textPrimary : COLORS.white}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 6 : 8,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  systemIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
});

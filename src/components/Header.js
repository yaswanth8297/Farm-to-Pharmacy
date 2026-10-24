import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  rightActionText,
  onRightAction,
}) {
  const { user, role, currentScreen, setCurrentScreen, unreadCount } = useApp();

  const isFarmer = role === 'farmer';

  // Dynamic greeting using signed-in user's name
  const firstName = (user?.name || '').replace(/^Dr\.\s*/, '').split(' ')[0];
  const headerSubtitle = subtitle || (isFarmer ? `${user?.location || 'Pune, MH'} · Verified Organic` : `${user?.organization || 'Pharmacy Tech'}`);
  const headerTitle =
    title ||
    (isFarmer
      ? `Namaste, ${firstName || 'Ramesh'} 🙏`
      : `Good Morning, Dr. ${firstName || 'Priya'} 👋`);

  return (
    <View style={styles.headerRoot}>
      <View style={styles.headerContent}>
        {/* Left Side: Back button OR App Brand Icon */}
        <View style={styles.leftGroup}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack || (() => setCurrentScreen('home'))}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandIconBox}>
              <Ionicons
                name={isFarmer ? 'leaf' : 'medkit'}
                size={18}
                color={isFarmer ? '#A3E635' : '#5EEAD4'}
              />
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.subtitleText}>{headerSubtitle}</Text>
            <Text style={styles.titleText} numberOfLines={1}>
              {headerTitle}
            </Text>
          </View>
        </View>

        {/* Right Side: Notification Bell + Avatar OR Right Action Text */}
        <View style={styles.rightGroup}>
          {rightActionText ? (
            <TouchableOpacity onPress={onRightAction} activeOpacity={0.7}>
              <Text style={styles.actionText}>{rightActionText}</Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Notification Bell */}
              <TouchableOpacity
                style={styles.bellButton}
                onPress={() => setCurrentScreen('notifications')}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
                {unreadCount > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Profile Avatar */}
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={() => setCurrentScreen('profile')}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    isFarmer
                      ? require('../../assets/images/farmer_avatar.png')
                      : require('../../assets/images/buyer_avatar.png')
                  }
                  style={styles.avatarImage}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRoot: {
    backgroundColor: COLORS.primaryHeader,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  subtitleText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F59E0B',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.primaryHeader,
  },
  bellBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

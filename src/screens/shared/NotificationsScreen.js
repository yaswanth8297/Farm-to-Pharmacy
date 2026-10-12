import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import AndroidStatusBar from '../../components/AndroidStatusBar';

export default function NotificationsScreen() {
  const {
    notifications,
    markAllNotificationsRead,
    setCurrentScreen,
    role,
  } = useApp();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return { name: 'leaf', color: '#16A34A', bg: '#DCFCE7' };
      case 'payment':
        return { name: 'cash', color: '#D97706', bg: '#FEF3C7' };
      case 'rewards':
        return { name: 'star', color: '#CA8A04', bg: '#FEF9C3' };
      case 'plant':
        return { name: 'flower', color: '#0D9488', bg: '#CCFBF1' };
      case 'delivery':
        return { name: 'checkbox', color: '#15803D', bg: '#DCFCE7' };
      default:
        return { name: 'notifications', color: COLORS.primary, bg: '#DCFCE7' };
    }
  };

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Alerts & Updates"
        title="Notifications"
        showBack
        onBack={() => setCurrentScreen('home')}
        rightActionText="Mark all read"
        onRightAction={markAllNotificationsRead}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.listContainer}>
          {notifications.map((item) => {
            const iconConfig = getNotificationIcon(item.type);
            return (
              <View
                key={item.id}
                style={[
                  styles.notifCard,
                  item.unread && styles.notifCardUnread,
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: iconConfig.bg },
                  ]}
                >
                  <Ionicons
                    name={iconConfig.name}
                    size={20}
                    color={iconConfig.color}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifMessage}>{item.message}</Text>
                  <Text style={styles.notifTime}>{item.timeText}</Text>
                </View>

                {item.unread && <View style={styles.unreadDot} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  },
  listContainer: {
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: '#F7FCF8',
    borderColor: '#BBF7D0',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notifMessage: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  notifTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginLeft: 8,
  },
});

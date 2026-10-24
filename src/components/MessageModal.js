import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function MessageModal() {
  const {
    messageModalVisible,
    setMessageModalVisible,
    activeChatRecipient,
    chatMessages,
    sendChatMessage,
    showToast,
  } = useApp();

  const recipientName = activeChatRecipient?.name || 'Ramesh Kumar (Farmer)';
  const threadKey = activeChatRecipient?.id || activeChatRecipient?.name || 'default';
  const messages = chatMessages[threadKey] || chatMessages['default'] || [];

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText, threadKey);
    setInputText('');
  };

  return (
    <Modal
      visible={messageModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setMessageModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.recipientInfo}>
              <View style={styles.avatarMini}>
                <Ionicons name="person" size={16} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.recipientName}>{recipientName}</Text>
                <Text style={styles.onlineStatus}>● Online · Farm verified</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setMessageModalVisible(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Messages list */}
          <ScrollView
            style={styles.msgList}
            contentContainerStyle={styles.msgContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <Text style={[styles.msgText, isMe && styles.msgTextMe]}>
                    {m.text}
                  </Text>
                  <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
                    {m.time}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Type message to grower..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  onlineStatus: {
    fontSize: 11,
    color: '#227A45',
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  msgContent: {
    paddingVertical: 14,
    gap: 10,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  msgTextMe: {
    color: COLORS.white,
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  msgTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

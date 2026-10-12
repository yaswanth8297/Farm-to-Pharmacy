import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  OFFLINE_DRAFTS: '@farmtopharmacy:offline_drafts',
  LISTINGS: '@farmtopharmacy:listings',
  ORDERS_FARMER: '@farmtopharmacy:orders_farmer',
  ORDERS_BUYER: '@farmtopharmacy:orders_buyer',
  CART: '@farmtopharmacy:cart',
  REWARDS_POINTS: '@farmtopharmacy:rewards_points',
  REDEEMED_VOUCHERS: '@farmtopharmacy:redeemed_vouchers',
  CURRENT_ROLE: '@farmtopharmacy:current_role',
};

export const StorageService = {
  // Offline Draft Caching for Farmers
  async saveDraft(draft) {
    try {
      const existing = await this.getDrafts();
      const updated = [draft, ...existing.filter((d) => d.id !== draft.id)];
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DRAFTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('StorageService.saveDraft error', e);
      return [];
    }
  },

  async getDrafts() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DRAFTS);
      return json != null ? JSON.parse(json) : [];
    } catch (e) {
      console.warn('StorageService.getDrafts error', e);
      return [];
    }
  },

  async removeDraft(draftId) {
    try {
      const existing = await this.getDrafts();
      const updated = existing.filter((d) => d.id !== draftId);
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DRAFTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('StorageService.removeDraft error', e);
      return [];
    }
  },

  // Persist and load any key
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('StorageService.setItem error', e);
    }
  },

  async getItem(key, defaultValue = null) {
    try {
      const json = await AsyncStorage.getItem(key);
      return json != null ? JSON.parse(json) : defaultValue;
    } catch (e) {
      console.warn('StorageService.getItem error', e);
      return defaultValue;
    }
  },

  STORAGE_KEYS,
};

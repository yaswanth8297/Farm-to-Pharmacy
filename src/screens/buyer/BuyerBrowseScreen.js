import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import AndroidStatusBar from '../../components/AndroidStatusBar';
import PlantCard from '../../components/PlantCard';
import { CATEGORIES } from '../../constants/plantData';

export default function BuyerBrowseScreen() {
  const { plants, setCurrentScreen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filterChips = ['All', 'Immunity', 'Skin & Digestive', 'Antibacterial'];

  const filteredPlants = plants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hindiName.includes(searchQuery) ||
      p.medicinalBenefits.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (activeCategory === 'Immunity') {
      matchesCategory = p.category === 'Immunity';
    } else if (activeCategory === 'Skin & Digestive') {
      matchesCategory = p.category === 'Skin Care' || p.category === 'Digestive';
    } else if (activeCategory === 'Antibacterial') {
      matchesCategory = p.category === 'Antibacterial';
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <AndroidStatusBar />
      <Header
        subtitle="Direct from farmers"
        title="Browse Plants"
        showBack
        onBack={() => setCurrentScreen('home')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or benefit..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Chips Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {filterChips.map((chip) => {
            const isActive = activeCategory === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chipPill,
                  isActive && styles.chipPillActive,
                ]}
                onPress={() => setActiveCategory(chip)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive && styles.chipTextActive,
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count & Sorting Headline */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {filteredPlants.length} plants available · Sorted by popularity
          </Text>
        </View>

        {/* 2-Column Grid */}
        <View style={styles.plantsGrid}>
          {filteredPlants.map((plant) => (
            <View key={plant.id} style={styles.gridColumn}>
              <PlantCard plant={plant} />
            </View>
          ))}
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
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chipPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  chipPillActive: {
    backgroundColor: '#1E5E28',
    borderColor: '#1E5E28',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  metaRow: {
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridColumn: {
    width: '48%',
  },
});

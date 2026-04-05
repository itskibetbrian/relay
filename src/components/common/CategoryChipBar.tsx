// src/components/common/CategoryChipBar.tsx

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Category } from '../../types';
import { COLORS } from '../../constants';

interface CategoryChipBarProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
  categories,
  activeId,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* "All" chip */}
      <Chip
        label="All"
        color="#7C3AED"
        isActive={activeId === null}
        onPress={() => onSelect(null)}
      />
      {categories.map(cat => (
        <Chip
          key={cat.id}
          label={cat.name}
          color={cat.color}
          isActive={activeId === cat.id}
          onPress={() => onSelect(cat.id)}
        />
      ))}
    </ScrollView>
  );
};

interface ChipProps {
  label: string;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, color, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      isActive
        ? { backgroundColor: '#7C3AED', borderColor: '#7C3AED' }
        : { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {isActive && <View style={[styles.activeDot, { backgroundColor: '#fff' }]} />}
    <Text
      style={[
        styles.chipText,
        { color: isActive ? '#fff' : color },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default CategoryChipBar;

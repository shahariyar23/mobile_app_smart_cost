import React from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';

export const PRESET_COLORS = [
  '#0F766E', // Blue/Teal (Primary)
  '#2563EB', // Blue
  '#16A34A', // Green
  '#EA580C', // Orange
  '#9333EA', // Purple
  '#DC2626', // Red
  '#0D9488', // Teal
  '#DB2777', // Pink
  '#4F46E5', // Indigo
];

type Props = {
  value?: string | null;
  onChange: (color: string) => void;
};

export function ColorPicker({value, onChange}: Props) {
  return (
    <View style={styles.container}>
      <AppText weight="semibold" style={styles.label}>রঙ নির্বাচন করুন</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {PRESET_COLORS.map(color => {
          const isSelected = value === color;
          return (
            <Pressable
              key={color}
              onPress={() => onChange(color)}
              style={[
                styles.colorCircle,
                {backgroundColor: color},
              ]}
            >
              {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  scroll: {
    gap: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
});

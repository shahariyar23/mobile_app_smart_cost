import React from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

export const PRESET_ICONS = [
  'fast-food', 'bus', 'cart', 'medkit', 'receipt',
  'school', 'game-controller', 'cash', 'laptop', 'briefcase',
  'airplane', 'cafe', 'barbell', 'paw', 'home',
  'car', 'shirt', 'wallet', 'gift', 'heart'
];

type Props = {
  value?: string | null;
  onChange: (icon: string) => void;
};

export function IconPicker({value, onChange}: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText weight="semibold" style={styles.label}>আইকন নির্বাচন করুন</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {PRESET_ICONS.map(icon => {
          const isSelected = value === icon;
          return (
            <Pressable
              key={icon}
              onPress={() => onChange(icon)}
              style={[
                styles.iconWrapper,
                {backgroundColor: isSelected ? theme.colors.primarySoft : theme.colors.surfaceAlt},
                isSelected && {borderColor: theme.colors.primary, borderWidth: 1}
              ]}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={isSelected ? theme.colors.primary : theme.colors.text}
              />
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
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

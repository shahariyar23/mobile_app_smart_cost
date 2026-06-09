import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'danger' | 'warning';
};

export function StatCard({label, value, tone = 'default'}: Props) {
  const theme = useAppTheme();
  const accent =
    tone === 'success'
      ? theme.colors.success
      : tone === 'danger'
        ? theme.colors.danger
        : tone === 'warning'
          ? theme.colors.warning
          : theme.colors.primary;

  return (
    <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
      <View style={[styles.dot, {backgroundColor: accent}]} />
      <AppText variant="caption" muted>{label}</AppText>
      <AppText variant="subtitle" weight="bold">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {flex: 1, minWidth: '46%', borderWidth: 1, borderRadius: 8, padding: 14, gap: 8},
  dot: {width: 10, height: 10, borderRadius: 5},
});

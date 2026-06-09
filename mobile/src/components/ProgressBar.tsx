import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  value: number;
  max: number;
  tone?: 'primary' | 'warning' | 'danger' | 'success';
};

export function ProgressBar({value, max, tone = 'primary'}: Props) {
  const theme = useAppTheme();
  const percent = Math.min(100, Math.max(0, (value / Math.max(max, 1)) * 100));
  const color = tone === 'warning' ? theme.colors.warning : tone === 'danger' ? theme.colors.danger : tone === 'success' ? theme.colors.success : theme.colors.primary;

  return (
    <View style={[styles.track, {backgroundColor: theme.colors.surfaceAlt}]}>
      <View style={[styles.fill, {backgroundColor: color, width: `${percent}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {height: 10, borderRadius: 5, overflow: 'hidden'},
  fill: {height: 10, borderRadius: 5},
});

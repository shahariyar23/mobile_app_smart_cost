import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  title: string;
  type: 'pie' | 'bar';
};

export function ChartPanel({title, type}: Props) {
  const theme = useAppTheme();


  return (
    <View style={[styles.panel, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
      <AppText weight="bold">{title}</AppText>
      <View style={styles.chart}>
        {type === 'pie' ? (
          <AppText muted>পাই চার্ট - শীঘ্রই আসছে</AppText>
        ) : (
          <AppText muted>বার চার্ট - শীঘ্রই আসছে</AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {borderWidth: 1, borderRadius: 8, padding: 16, gap: 14, overflow: 'hidden'},
  chart: {alignItems: 'center', minHeight: 190, justifyContent: 'center'},
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  title: string;
  type: 'pie' | 'bar';
};

export function ChartPanel({title, type}: Props) {
  const theme = useAppTheme();
  const pieData = [
    {value: 42, color: theme.colors.primary, text: 'বাজার'},
    {value: 24, color: theme.colors.warning, text: 'ভাড়া'},
    {value: 18, color: theme.colors.success, text: 'খাবার'},
    {value: 16, color: theme.colors.danger, text: 'অন্যান্য'},
  ];
  const barData = [
    {label: '১ম', value: 12000, frontColor: theme.colors.primary},
    {label: '২য়', value: 8000, frontColor: theme.colors.warning},
    {label: '৩য়', value: 15000, frontColor: theme.colors.success},
    {label: '৪র্থ', value: 10500, frontColor: theme.colors.danger},
  ];

  return (
    <View style={[styles.panel, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
      <AppText weight="bold">{title}</AppText>
      <View style={styles.chart}>
        {type === 'pie' ? (
          <PieChart data={pieData} donut radius={84} innerRadius={50} showText textColor={theme.colors.text} />
        ) : (
          <BarChart
            data={barData}
            height={170}
            barWidth={28}
            spacing={26}
            yAxisTextStyle={{color: theme.colors.muted}}
            xAxisLabelTextStyle={{color: theme.colors.muted}}
            rulesColor={theme.colors.border}
            yAxisColor={theme.colors.border}
            xAxisColor={theme.colors.border}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {borderWidth: 1, borderRadius: 8, padding: 16, gap: 14, overflow: 'hidden'},
  chart: {alignItems: 'center', minHeight: 190, justifyContent: 'center'},
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PieChart, BarChart} from 'react-native-gifted-charts';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';
import {formatTaka} from '@/utils/currency';

type Props = {
  title: string;
  type: 'pie' | 'bar';
  data?: any[];
};

export function ChartPanel({title, type, data}: Props) {
  const theme = useAppTheme();

  return (
    <View style={[styles.panel, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
      <AppText weight="bold">{title}</AppText>
      <View style={styles.chart}>
        {(!data || data.length === 0) ? (
          <AppText muted>কোনো তথ্য নেই</AppText>
        ) : type === 'pie' ? (
          <>
            <PieChart
              data={data}
              radius={88}
              donut
              innerRadius={56}
              innerCircleColor={theme.colors.surface}
              showText={false}
              textStyle={{fontSize: 12}}
              centerLabelComponent={() => {
                const total = data.reduce((s, i) => s + (Number(i.value) || 0), 0);
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <AppText variant="caption" muted>মোট</AppText>
                    <AppText weight="bold">{formatTaka(total)}</AppText>
                  </View>
                );
              }}
            />
            <View style={styles.legend}>
              {data.map((d, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.legendColor, {backgroundColor: d.color}]} />
                  <AppText style={styles.legendText}>{d.text} — {formatTaka(Number(d.value) || 0)}</AppText>
                </View>
              ))}
            </View>
          </>
        ) : (
          (() => {
            const values = data.map(d => Number(d.value) || 0);
            const max = Math.max(...values, 0);
            const sections = 4;
            const step = Math.ceil((max || 1) / sections);
            const yLabels = [] as number[];
            for (let i = sections; i >= 0; i--) {
              yLabels.push(i * step);
            }

            return (
              <View style={styles.barContainer}>
                <View style={styles.yAxis}>
                  {yLabels.map((n, idx) => (
                    <AppText key={idx} style={styles.yAxisText}>{formatTaka(n)}</AppText>
                  ))}
                </View>
                <View style={styles.barWrapper}>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}><View style={[styles.legendColor, {backgroundColor: '#4CAF50'}]} /><AppText style={styles.legendText}>আয়</AppText></View>
                    <View style={styles.legendItem}><View style={[styles.legendColor, {backgroundColor: '#F44336'}]} /><AppText style={styles.legendText}>খরচ</AppText></View>
                  </View>
                  <BarChart
                    data={data}
                    barWidth={14}
                    spacing={6}
                    noOfSections={sections}
                    barBorderRadius={6}
                    frontColor={theme.colors.primary}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    hideRules={false}
                    showVerticalLines={false}
                    showXAxisIndices={true}
                    isAnimated
                    animationDuration={600}
                    xAxisLabelTextStyle={{color: theme.colors.text, fontSize: 10, width: 30}}
                    hideYAxisText={true}
                  />
                </View>
              </View>
            );
          })()
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {borderWidth: 1, borderRadius: 8, padding: 16, gap: 14, overflow: 'hidden', elevation: 2},
  chart: {alignItems: 'center', minHeight: 190, justifyContent: 'center'},
  legend: {marginTop: 12, width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  legendItem: {flexDirection: 'row', alignItems: 'center', marginRight: 12},
  legendColor: {width: 12, height: 12, borderRadius: 3, marginRight: 8},
  legendText: {fontSize: 12},
  barContainer: {flexDirection: 'row', width: '100%', alignItems: 'flex-start'},
  yAxis: {width: 56, alignItems: 'flex-end', paddingRight: 8},
  yAxisText: {fontSize: 11, color: '#666', height: 32},
  barWrapper: {flex: 1},
  axisFooter: {marginTop: 8, alignItems: 'flex-start'},
  legendRow: {flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginBottom: 6},
});

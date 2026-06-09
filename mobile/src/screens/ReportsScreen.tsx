import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {reportsApi} from '@/api/reports';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {ChartPanel} from '@/components/ChartPanel';
import {EmptyState} from '@/components/EmptyState';
import {Screen} from '@/components/Screen';
import {ReportRange} from '@/types';
import {formatTaka} from '@/utils/currency';

export function ReportsScreen() {
  const [range, setRange] = React.useState<ReportRange>('monthly');
  const report = useQuery({queryKey: ['reports', range], queryFn: () => reportsApi.get(range)});

  return (
    <Screen>
      <AppText variant="title" weight="bold">রিপোর্ট</AppText>
      <View style={styles.tabs}>
        <AppButton title="সাপ্তাহিক" variant={range === 'weekly' ? 'primary' : 'secondary'} onPress={() => setRange('weekly')} style={styles.tab} />
        <AppButton title="মাসিক" variant={range === 'monthly' ? 'primary' : 'secondary'} onPress={() => setRange('monthly')} style={styles.tab} />
        <AppButton title="বার্ষিক" variant={range === 'yearly' ? 'primary' : 'secondary'} onPress={() => setRange('yearly')} style={styles.tab} />
      </View>
      <ChartPanel title="রিপোর্ট চার্ট" type="bar" />
      {report.data?.length ? report.data.map(point => (
        <View key={point.label} style={styles.row}>
          <AppText weight="semibold">{point.label}</AppText>
          <AppText muted>আয় {formatTaka(point.income)} | খরচ {formatTaka(point.expense)}</AppText>
        </View>
      )) : <EmptyState title="রিপোর্ট ডেটা নেই" />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {flexDirection: 'row', gap: 8},
  tab: {flex: 1, minHeight: 44},
  row: {gap: 4},
});

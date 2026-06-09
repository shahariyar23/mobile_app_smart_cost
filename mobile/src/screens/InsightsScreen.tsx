import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {insightsApi} from '@/api/insights';
import {AppText} from '@/components/AppText';
import {EmptyState} from '@/components/EmptyState';
import {ProgressBar} from '@/components/ProgressBar';
import {Screen} from '@/components/Screen';
import {useAppTheme} from '@/hooks/useAppTheme';

export function InsightsScreen() {
  const theme = useAppTheme();
  const insights = useQuery({queryKey: ['insights', 'monthly'], queryFn: insightsApi.monthly});
  const data = insights.data;

  return (
    <Screen>
      <AppText variant="title" weight="bold">এআই ইনসাইটস</AppText>
      {data ? (
        <>
          <View style={[styles.score, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <AppText muted>মাসিক ফাইন্যান্সিয়াল স্কোর</AppText>
            <AppText variant="title" weight="bold">{data.financialScore}/১০০</AppText>
            <ProgressBar value={data.financialScore} max={100} tone="success" />
          </View>
          <InsightList title="খরচ বিশ্লেষণ" items={data.spendingAnalysis} />
          <InsightList title="সঞ্চয় পরামর্শ" items={data.savingSuggestions} />
        </>
      ) : (
        <EmptyState title="ইনসাইট প্রস্তুত হচ্ছে" message="লেনদেন যোগ করলে এআই বিশ্লেষণ দেখা যাবে।" />
      )}
    </Screen>
  );
}

function InsightList({title, items}: {title: string; items: string[]}) {
  return (
    <View style={styles.list}>
      <AppText variant="subtitle" weight="bold">{title}</AppText>
      {items.map(item => <AppText key={item}>• {item}</AppText>)}
    </View>
  );
}

const styles = StyleSheet.create({
  score: {borderWidth: 1, borderRadius: 8, padding: 16, gap: 10},
  list: {gap: 8},
});

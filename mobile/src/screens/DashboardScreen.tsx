import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ChartPanel} from '@/components/ChartPanel';
import {EmptyState} from '@/components/EmptyState';
import {Screen} from '@/components/Screen';
import {StatCard} from '@/components/StatCard';
import {TransactionListItem} from '@/components/TransactionListItem';
import {AppText} from '@/components/AppText';
import {useFinancialSummary, useTransactions} from '@/hooks/useTransactions';
import {formatTaka} from '@/utils/currency';

const fallbackSummary = {currentBalance: 0, monthlyIncome: 0, monthlyExpense: 0, savings: 0};

export function DashboardScreen() {
  const summaryQuery = useFinancialSummary();
  const transactionsQuery = useTransactions();
  const summary = summaryQuery.data ?? fallbackSummary;
  const recent = transactionsQuery.data?.slice(0, 5) ?? [];

  return (
    <Screen>
      <AppText variant="title" weight="bold">ড্যাশবোর্ড</AppText>
      <View style={styles.grid}>
        <StatCard label="বর্তমান ব্যালেন্স" value={formatTaka(summary.currentBalance)} />
        <StatCard label="মাসিক আয়" value={formatTaka(summary.monthlyIncome)} tone="success" />
        <StatCard label="মাসিক খরচ" value={formatTaka(summary.monthlyExpense)} tone="danger" />
        <StatCard label="সঞ্চয়" value={formatTaka(summary.savings)} tone="warning" />
      </View>
      <ChartPanel title="খরচের ক্যাটাগরি" type="pie" />
      <ChartPanel title="সাপ্তাহিক আয়-খরচ" type="bar" />
      <AppText variant="subtitle" weight="bold">সাম্প্রতিক লেনদেন</AppText>
      {recent.length ? recent.map(item => <TransactionListItem key={item.id} transaction={item} />) : (
        <EmptyState title="কোনো লেনদেন নেই" message="মাইক বাটন চাপুন বা নতুন লেনদেন যোগ করুন।" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
});

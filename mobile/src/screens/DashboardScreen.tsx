import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ChartPanel} from '@/components/ChartPanel';
import {EmptyState} from '@/components/EmptyState';
import {Screen} from '@/components/Screen';
import {StatCard} from '@/components/StatCard';
import {TransactionListItem} from '@/components/TransactionListItem';
import {AppText} from '@/components/AppText';
import {useFinancialSummary, useTransactions} from '@/hooks/useTransactions';
import {formatTaka} from '@/utils/currency';
import {categoryLabels} from '@/constants/categories';
import {CategoryKey} from '@/types';

const fallbackSummary = {currentBalance: 0, monthlyIncome: 0, monthlyExpense: 0, savings: 0, categoryBreakdown: {}};

export function DashboardScreen() {
  const summaryQuery = useFinancialSummary();
  const transactionsQuery = useTransactions();
  const summary = summaryQuery.data ?? fallbackSummary;
  const recent = transactionsQuery.data?.slice(0, 5) ?? [];

  const pieData = useMemo(() => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return Object.entries(summary.categoryBreakdown || {})
      .filter(([, value]) => Number(value) > 0)
      .map(([key, value], index) => ({
        value: Number(value),
        color: colors[index % colors.length],
        text: categoryLabels[key as CategoryKey] || key,
      }));
  }, [summary.categoryBreakdown]);

  const barData = useMemo(() => {
    if (!transactionsQuery.data) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dataByDay: Record<string, {income: number; expense: number}> = {};
    const daysInEnglish = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dataByDay[d.toISOString().split('T')[0]] = {income: 0, expense: 0, label: daysInEnglish[d.getDay()]};
    }

    transactionsQuery.data.forEach(t => {
      const date = t.occurredAt.split('T')[0];
      if (dataByDay[date]) {
        if (t.type === 'income') dataByDay[date].income += Number(t.amount);
        else if (t.type === 'expense') dataByDay[date].expense += Number(t.amount);
      }
    });

    const chartData: any[] = [];
    Object.entries(dataByDay).forEach(([date, vals]) => {
      chartData.push({value: vals.income, label: vals.label, frontColor: '#4CAF50', spacing: 2});
      chartData.push({value: vals.expense, label: '', frontColor: '#F44336'});
    });
    return chartData;
  }, [transactionsQuery.data]);

  return (
    <Screen>
      <AppText variant="title" weight="bold">ড্যাশবোর্ড</AppText>
      <View style={styles.grid}>
        <StatCard label="বর্তমান ব্যালেন্স" value={formatTaka(summary.currentBalance)} />
        <StatCard label="মাসিক আয়" value={formatTaka(summary.monthlyIncome)} tone="success" />
        <StatCard label="মাসিক খরচ" value={formatTaka(summary.monthlyExpense)} tone="danger" />
        <StatCard label="সঞ্চয়" value={formatTaka(summary.savings)} tone="warning" />
      </View>
      <ChartPanel title="খরচের ক্যাটাগরি" type="pie" data={pieData} />
      <ChartPanel title="সাপ্তাহিক আয়-খরচ" type="bar" data={barData} />
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

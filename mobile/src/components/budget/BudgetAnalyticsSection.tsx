import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {AppText} from '@/components/AppText';
import {BudgetAnalytics} from '@/api/budgets';

const {width} = Dimensions.get('window');

interface BudgetAnalyticsSectionProps {
  analytics?: BudgetAnalytics;
  isDark: boolean;
}

export function BudgetAnalyticsSection({analytics, isDark}: BudgetAnalyticsSectionProps) {
  const colors = isDark
    ? {
        surface: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
        gridLine: '#2D3748',
      }
    : {
        surface: '#F8F9FB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
        gridLine: '#E5E7EB',
      };

  if (!analytics) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <AppText
          weight="bold"
          style={[styles.chartTitle, {color: colors.text}]}
        >
          ক্যাটাগরি ইনসাইটস
        </AppText>

        <View style={styles.pieContainer}>
          <View style={styles.pieItem}>
            <View>
              <AppText style={[styles.pieName, {color: colors.text}]}>
                সবচেয়ে বেশি খরচ
              </AppText>
              <AppText style={[styles.piePercent, {color: colors.textMuted}]}>
                {analytics.most_spent_category || 'তথ্য নেই'}
              </AppText>
            </View>
          </View>
          <View style={[styles.pieItem, {marginTop: 12}]}>
            <View>
              <AppText style={[styles.pieName, {color: colors.text}]}>
                সবচেয়ে কম খরচ
              </AppText>
              <AppText style={[styles.piePercent, {color: colors.textMuted}]}>
                {analytics.least_spent_category || 'তথ্য নেই'}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    width: 50,
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  pieContainer: {
    gap: 12,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pieColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  pieName: {
    fontSize: 13,
    fontWeight: '600',
  },
  piePercent: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  pieValue: {
    fontSize: 12,
    marginLeft: 'auto',
  },
});

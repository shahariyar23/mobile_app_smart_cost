import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '@/components/AppText';
import {formatTaka} from '@/utils/currency';
import {BudgetHistory} from '@/api/budgets';

interface BudgetHistorySectionProps {
  history?: BudgetHistory[];
  isDark: boolean;
}

export function BudgetHistorySection({history, isDark}: BudgetHistorySectionProps) {
  const colors = isDark
    ? {
        surface: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
      }
    : {
        surface: '#F8F9FB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
      };

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {history.map((item, index) => {
        const percent = item.utilization_percentage;
        const saved = Math.max(0, item.total_budget - item.total_spent);
        const trend = percent > 85 ? 'up' : 'down';

        return (
          <View
            key={`history-${index}`}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <AppText
                weight="bold"
                style={[styles.month, {color: colors.text}]}
              >
                {item.month}/{item.year}
              </AppText>
              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor: item.trend === 'up' ? '#FEE2E2' : '#DBEAFE',
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.trendIcon,
                    {
                      color: item.trend === 'up' ? '#DC2626' : '#0284C7',
                    },
                  ]}
                >
                  {item.trend === 'up' ? '↑' : '↓'} {percent}%
                </AppText>
              </View>
            </View>

            {/* Metrics */}
            <View style={styles.metrics}>
              <View style={styles.metricBox}>
                <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
                  বাজেট
                </AppText>
                <AppText
                  weight="bold"
                  style={[styles.metricValue, {color: colors.text}]}
                >
                  {formatTaka(item.total_budget)}
                </AppText>
              </View>

              <View style={styles.metricBox}>
                <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
                  খরচ
                </AppText>
                <AppText
                  weight="bold"
                  style={[styles.metricValue, {color: '#EF4444'}]}
                >
                  {formatTaka(item.total_spent)}
                </AppText>
              </View>

              <View style={styles.metricBox}>
                <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
                  সঞ্চয়
                </AppText>
                <AppText
                  weight="bold"
                  style={[styles.metricValue, {color: '#10B981'}]}
                >
                  {formatTaka(saved)}
                </AppText>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBarBg,
                  {backgroundColor: isDark ? '#2D3748' : '#E5E7EB'},
                ]}
              >
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(percent, 100)}%`,
                      backgroundColor:
                        percent <= 70
                          ? '#10B981'
                          : percent <= 85
                          ? '#F59E0B'
                          : '#EF4444',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    fontSize: 14,
    fontWeight: '700',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricBox: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

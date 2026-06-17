import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {AppText} from '@/components/AppText';
import {formatTaka} from '@/utils/currency';

const CATEGORIES = [
  {name: 'খাবার', budget: 8000, spent: 5600, icon: '🍕'},
  {name: 'পরিবহন', budget: 5000, spent: 3200, icon: '🚗'},
  {name: 'কেনাকাটা', budget: 6000, spent: 4500, icon: '🛍️'},
  {name: 'চিকিৎসা', budget: 3000, spent: 1200, icon: '⚕️'},
  {name: 'বিল', budget: 4000, spent: 3800, icon: '💰'},
  {name: 'শিক্ষা', budget: 3500, spent: 2100, icon: '📚'},
  {name: 'বিনোদন', budget: 2500, spent: 1600, icon: '🎬'},
];

interface CategoryBudgetCardsProps {
  isDark: boolean;
}

export function CategoryBudgetCards({isDark}: CategoryBudgetCardsProps) {
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

  const getProgressColor = (percent: number) => {
    if (percent <= 70) return '#10B981';
    if (percent <= 85) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContent}
    >
      {CATEGORIES.map((category, index) => {
        const percent = Math.round((category.spent / category.budget) * 100);
        const remaining = Math.max(0, category.budget - category.spent);

        return (
          <View
            key={`${category.name}-${index}`}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitle}>
                <AppText style={styles.categoryIcon}>{category.icon}</AppText>
                <View>
                  <AppText
                    weight="bold"
                    style={[styles.categoryName, {color: colors.text}]}
                  >
                    {category.name}
                  </AppText>
                  <AppText
                    style={[styles.categoryBudget, {color: colors.textMuted}]}
                  >
                    {formatTaka(category.budget)} বাজেট
                  </AppText>
                </View>
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
                      backgroundColor: getProgressColor(percent),
                    },
                  ]}
                />
              </View>
              <AppText
                style={[styles.percentText, {color: colors.textMuted}]}
              >
                {percent}%
              </AppText>
            </View>

            {/* Metrics */}
            <View style={styles.metrics}>
              <View>
                <AppText
                  style={[styles.metricLabel, {color: colors.textMuted}]}
                >
                  খরচ
                </AppText>
                <AppText
                  weight="bold"
                  style={[styles.metricValue, {color: getProgressColor(percent)}]}
                >
                  {formatTaka(category.spent)}
                </AppText>
              </View>

              <View style={styles.divider} />

              <View>
                <AppText
                  style={[styles.metricLabel, {color: colors.textMuted}]}
                >
                  বাকি
                </AppText>
                <AppText
                  weight="bold"
                  style={[
                    styles.metricValue,
                    {color: remaining > 0 ? '#10B981' : '#EF4444'},
                  ]}
                >
                  {formatTaka(remaining)}
                </AppText>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    width: 160,
    gap: 12,
  },
  categoryHeader: {
    gap: 8,
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryBudget: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  progressContainer: {
    gap: 6,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    opacity: 0.2,
  },
});

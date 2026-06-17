import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '@/components/AppText';
import {formatTaka} from '@/utils/currency';

interface DailyRecommendationCardProps {
  remaining: number;
  daysLeft: number;
  dailyRecommendation: number;
  isDark: boolean;
}

export function DailyRecommendationCard({
  remaining,
  daysLeft,
  dailyRecommendation,
  isDark,
}: DailyRecommendationCardProps) {
  const colors = isDark
    ? {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        surface: '#1A1F2E',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
      }
    : {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        surface: '#F8F9FB',
        text: '#FFFFFF',
        textMuted: '#E5E7EB',
      };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1A1F2E' : '#F8F9FB',
          borderColor: isDark ? '#2D3748' : '#E5E7EB',
        },
      ]}
    >
      {/* Gradient Background Shimmer */}
      <View
        style={[
          styles.gradientBg,
          {
            backgroundColor: isDark ? '#667eea' : '#667eea',
            opacity: 0.1,
          },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.leftColumn}>
          <AppText
            style={[styles.recommendationLabel, {color: isDark ? '#A0AEC0' : '#6B7280'}]}
          >
            আজকের সুপারিশ
          </AppText>
          <AppText
            weight="bold"
            style={[styles.recommendationValue, {color: isDark ? '#FFFFFF' : '#111827'}]}
          >
            {formatTaka(dailyRecommendation)}
            <AppText style={[styles.recommendationSuffix, {color: isDark ? '#A0AEC0' : '#6B7280'}]}>
              /দিন
            </AppText>
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsColumn}>
          <View style={styles.statBox}>
            <AppText style={[styles.statLabel, {color: isDark ? '#A0AEC0' : '#6B7280'}]}>
              বাকি বাজেট
            </AppText>
            <AppText weight="bold" style={[styles.statValue, {color: '#10B981'}]}>
              {formatTaka(remaining)}
            </AppText>
          </View>

          <View style={styles.statBox}>
            <AppText style={[styles.statLabel, {color: isDark ? '#A0AEC0' : '#6B7280'}]}>
              দিন বাকি
            </AppText>
            <AppText weight="bold" style={[styles.statValue, {color: isDark ? '#FFFFFF' : '#111827'}]}>
              {daysLeft}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 1,
  },
  leftColumn: {
    flex: 0.5,
  },
  recommendationLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  recommendationSuffix: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#E5E7EB',
    opacity: 0.3,
  },
  statsColumn: {
    flex: 0.5,
    gap: 12,
  },
  statBox: {
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

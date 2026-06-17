import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {AppText} from '@/components/AppText';
import {formatTaka} from '@/utils/currency';
import Svg, {Circle, CircleProps} from 'react-native-svg';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface BudgetOverviewCardProps {
  totalBudget: number;
  spent: number;
  remaining: number;
  usagePercent: number;
  isDark: boolean;
}

export function BudgetOverviewCard({
  totalBudget,
  spent,
  remaining,
  usagePercent,
  isDark,
}: BudgetOverviewCardProps) {
  const colors = isDark
    ? {
        bg: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
        circle: '#38B6FF',
        circleBg: '#1E293B',
      }
    : {
        bg: '#F8F9FB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
        circle: '#3B82F6',
        circleBg: '#F3F4F6',
      };

  const getCircleColor = () => {
    if (usagePercent <= 70) return '#10B981';
    if (usagePercent <= 85) return '#F59E0B';
    return '#EF4444';
  };

  const strokeDashoffset = useMemo(() => {
    return CIRCUMFERENCE - (usagePercent / 100) * CIRCUMFERENCE;
  }, [usagePercent]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Left Column - Metrics */}
        <View style={styles.metricsColumn}>
          <View style={styles.metricBox}>
            <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
              মোট বাজেট
            </AppText>
            <AppText
              weight="bold"
              style={[styles.metricValue, {color: colors.text}]}
            >
              {formatTaka(totalBudget)}
            </AppText>
          </View>

          <View style={styles.metricBox}>
            <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
              খরচ
            </AppText>
            <AppText
              weight="bold"
              style={[styles.metricValue, {color: getCircleColor()}]}
            >
              {formatTaka(spent)}
            </AppText>
          </View>

          <View style={styles.metricBox}>
            <AppText style={[styles.metricLabel, {color: colors.textMuted}]}>
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

        {/* Right Column - Circular Progress */}
        <View style={styles.circleContainer}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
            {/* Background Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={colors.circleBg}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={getCircleColor()}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{transform: [{rotate: '-90deg'}]}}
            />
          </Svg>

          {/* Center Text */}
          <View style={styles.circleCenterText}>
            <AppText
              weight="bold"
              style={[styles.percentText, {color: colors.text}]}
            >
              {usagePercent}%
            </AppText>
            <AppText style={[styles.percentLabel, {color: colors.textMuted}]}>
              ব্যবহৃত
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
    padding: 20,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  metricsColumn: {
    flex: 1,
    gap: 16,
  },
  metricBox: {
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 28,
    fontWeight: '700',
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});

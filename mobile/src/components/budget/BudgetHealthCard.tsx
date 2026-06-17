import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '@/components/AppText';
import Svg, {Circle} from 'react-native-svg';

interface BudgetHealthCardProps {
  score: number;
  status: string;
  isDark: boolean;
}

const GAUGE_SIZE = 120;
const GAUGE_RADIUS = 50;

export function BudgetHealthCard({score, status, isDark}: BudgetHealthCardProps) {
  const colors = isDark
    ? {
        bg: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
      }
    : {
        bg: '#F8F9FB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
      };

  const getStatusColor = () => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#F59E0B';
    if (score >= 50) return '#EF4444';
    return '#DC2626';
  };

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
        <View style={styles.gaugeContainer}>
          <Svg width={GAUGE_SIZE} height={GAUGE_SIZE / 2 + 20} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE / 2 + 20}`}>
            {/* Background Arc */}
            <Circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={GAUGE_RADIUS}
              stroke={isDark ? '#2D3748' : '#E5E7EB'}
              strokeWidth={6}
              fill="none"
              strokeDasharray={`${(score / 100) * (Math.PI * GAUGE_RADIUS * 2)}, ${((100 - score) / 100) * (Math.PI * GAUGE_RADIUS * 2)}`}
              strokeLinecap="round"
              style={{transform: [{rotate: '180deg'}]}}
            />
          </Svg>

          <View style={styles.scoreText}>
            <AppText weight="bold" style={[styles.scoreNumber, {color: getStatusColor()}]}>
              {score}/100
            </AppText>
          </View>
        </View>

        <View style={styles.statusBox}>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: getStatusColor()},
            ]}
          />
          <View>
            <AppText style={[styles.statusLabel, {color: colors.textMuted}]}>
              বাজেট স্ট্যাটাস
            </AppText>
            <AppText weight="bold" style={[styles.statusValue, {color: colors.text}]}>
              {status}
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  gaugeContainer: {
    flex: 0.4,
    alignItems: 'center',
  },
  scoreText: {
    marginTop: -10,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 18,
  },
  statusBox: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    marginTop: 4,
  },
});

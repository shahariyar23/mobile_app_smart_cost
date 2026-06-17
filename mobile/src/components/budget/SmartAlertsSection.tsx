import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '@/components/AppText';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Alert {
  type: 'warning' | 'danger' | 'info';
  icon: string;
  message: string;
}

interface SmartAlertsSectionProps {
  alerts: Alert[];
  isDark: boolean;
}

export function SmartAlertsSection({alerts, isDark}: SmartAlertsSectionProps) {
  const getAlertStyle = (type: Alert['type']) => {
    if (type === 'danger') {
      return {
        bg: isDark ? '#7F1D1D' : '#FEE2E2',
        border: isDark ? '#991B1B' : '#FECACA',
        text: isDark ? '#FCA5A5' : '#DC2626',
      };
    } else if (type === 'warning') {
      return {
        bg: isDark ? '#78350F' : '#FEF3C7',
        border: isDark ? '#A16207' : '#FCD34D',
        text: isDark ? '#FCD34D' : '#D97706',
      };
    } else {
      return {
        bg: isDark ? '#0C4A6E' : '#DBEAFE',
        border: isDark ? '#0E7490' : '#BFDBFE',
        text: isDark ? '#38BDF8' : '#0284C7',
      };
    }
  };

  return (
    <View style={styles.container}>
      {alerts.map((alert, index) => {
        const style = getAlertStyle(alert.type);

        return (
          <View
            key={`alert-${index}`}
            style={[
              styles.alertCard,
              {
                backgroundColor: style.bg,
                borderColor: style.border,
              },
            ]}
          >
            <View style={styles.alertContent}>
              <Ionicons name={alert.icon as any} size={20} color={style.text} style={styles.alertIcon} />
              <AppText style={[styles.alertMessage, {color: style.text}]}>
                {alert.message}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  alertCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  alertMessage: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});

import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  total: number;
  income: number;
  expense: number;
};

export function CategorySummaryCards({total, income, expense}: Props) {
  const theme = useAppTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      <Card
        title="মোট ক্যাটাগরি"
        count={total}
        icon="albums"
        colors={['#4facfe', '#00f2fe']}
      />
      <Card
        title="আয় ক্যাটাগরি"
        count={income}
        icon="arrow-down-circle"
        colors={['#43e97b', '#38f9d7']}
      />
      <Card
        title="খরচ ক্যাটাগরি"
        count={expense}
        icon="arrow-up-circle"
        colors={['#fa709a', '#fee140']}
      />
    </ScrollView>
  );
}

function Card({title, count, icon, colors}: {title: string; count: number; icon: any; colors: readonly [string, string, ...string[]]}) {
  return (
    <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.card}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View>
        <AppText style={styles.title}>{title}</AppText>
        <AppText weight="bold" style={styles.count}>{count} টি</AppText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
    paddingVertical: 8,
  },
  card: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
  },
  count: {
    color: '#fff',
    fontSize: 18,
  },
});

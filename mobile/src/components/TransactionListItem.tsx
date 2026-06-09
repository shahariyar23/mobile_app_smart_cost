import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {categoryLabels} from '@/constants/categories';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';
import {Transaction} from '@/types';
import {formatTaka} from '@/utils/currency';
import {formatBanglaDate} from '@/utils/date';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionListItem({transaction, onPress}: Props) {
  const theme = useAppTheme();
  const isIncome = transaction.type === 'income';

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.row,
        {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.85 : 1},
      ]}>
      <View style={[styles.icon, {backgroundColor: isIncome ? theme.colors.primarySoft : theme.colors.surfaceAlt}]}>
        <AppText weight="bold" style={{color: isIncome ? theme.colors.success : theme.colors.danger}}>
          {isIncome ? '+' : '-'}
        </AppText>
      </View>
      <View style={styles.middle}>
        <AppText weight="semibold">{categoryLabels[transaction.category]}</AppText>
        <AppText variant="caption" muted numberOfLines={1}>{transaction.note || formatBanglaDate(transaction.occurredAt)}</AppText>
      </View>
      <AppText weight="bold" style={{color: isIncome ? theme.colors.success : theme.colors.danger}}>
        {isIncome ? '+' : '-'}{formatTaka(transaction.amount)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {borderWidth: 1, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'},
  middle: {flex: 1},
});

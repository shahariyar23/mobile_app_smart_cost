import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {EmptyState} from '@/components/EmptyState';
import {Screen} from '@/components/Screen';
import {TransactionListItem} from '@/components/TransactionListItem';
import {useTransactions} from '@/hooks/useTransactions';
import {MainTabScreenProps} from '@/navigation/types';
import {TransactionType} from '@/types';

export function TransactionsScreen({navigation}: MainTabScreenProps<'Transactions'>) {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState<TransactionType | 'all'>('all');
  const transactions = useTransactions({search, type});

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title" weight="bold">লেনদেন</AppText>
        <AppButton title="নতুন" onPress={() => navigation.navigate('TransactionEditor', {})} style={styles.addButton} />
      </View>
      <AppInput label="সার্চ" placeholder="ক্যাটাগরি বা নোট খুঁজুন" value={search} onChangeText={setSearch} />
      <View style={styles.filters}>
        <FilterButton active={type === 'all'} label="সব" onPress={() => setType('all')} />
        <FilterButton active={type === 'income'} label="আয়" onPress={() => setType('income')} />
        <FilterButton active={type === 'expense'} label="খরচ" onPress={() => setType('expense')} />
      </View>
      {transactions.data?.length ? transactions.data.map(item => (
        <TransactionListItem
          key={item.id}
          transaction={item}
          onPress={() => navigation.navigate('TransactionEditor', {transaction: item})}
        />
      )) : (
        <EmptyState title="ফলাফল নেই" message="ফিল্টার বদলান বা নতুন লেনদেন যোগ করুন।" />
      )}
    </Screen>
  );
}

function FilterButton({active, label, onPress}: {active: boolean; label: string; onPress: () => void}) {
  return <AppButton title={label} variant={active ? 'primary' : 'secondary'} onPress={onPress} style={styles.filterButton} />;
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  addButton: {minHeight: 44, minWidth: 96},
  filters: {flexDirection: 'row', gap: 8},
  filterButton: {flex: 1, minHeight: 44},
});

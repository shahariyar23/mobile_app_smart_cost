import React, {useMemo} from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {AppText} from '@/components/AppText';
import {ChartPanel} from '@/components/ChartPanel';
import {TransactionListItem} from '@/components/TransactionListItem';
import {Screen} from '@/components/Screen';
import {useCategories} from '@/hooks/useCategories';
import {useTransactions} from '@/hooks/useTransactions';
import {useAppTheme} from '@/hooks/useAppTheme';
import {RootStackScreenProps} from '@/navigation/types';
import {formatTaka} from '@/utils/currency';

export function CategoryDetailsScreen({route, navigation}: RootStackScreenProps<'CategoryDetails'>) {
  const {categoryId} = route.params;
  const theme = useAppTheme();
  
  const {data: categories = []} = useCategories();
  const category = categories.find(c => c.id === categoryId);
  
  const {data: allTransactions = []} = useTransactions({type: 'all'});
  
  const transactions = useMemo(() => {
    if (!category) return [];
    return allTransactions.filter(t => t.category === category.name);
  }, [allTransactions, category]);

  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const chartData = useMemo(() => {
    // Generate some mock chart data based on transactions
    // If there are transactions, group by month (mocking it using the last 4 sections)
    const data = [];
    if (transactions.length > 0) {
      data.push({value: totalAmount * 0.2, label: 'W1'});
      data.push({value: totalAmount * 0.3, label: 'W2'});
      data.push({value: totalAmount * 0.1, label: 'W3'});
      data.push({value: totalAmount * 0.4, label: 'W4'});
    }
    return data;
  }, [totalAmount, transactions]);

  if (!category) return null;

  const isIncome = category.type === 'income';
  const color = category.color || theme.colors.primary;

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border}]}>
        <View style={styles.headerTop}>
           <Pressable onPress={() => navigation.goBack()} style={{padding: 4, marginRight: 8}}>
             <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
           </Pressable>
           <View style={{flex: 1}}>
             <AppText variant="title" weight="bold">ক্যাটাগরি বিস্তারিত</AppText>
             <AppText muted variant="caption">স্ট্যাটিস্টিক্স এবং লেনদেনসমূহ</AppText>
           </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Category Header Card */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <View style={styles.cardHeader}>
             <View style={[styles.iconWrap, {backgroundColor: 'rgba(0,0,0,0.05)'}]}>
               <Ionicons name={(category.icon as any) || 'list'} size={32} color={color} />
             </View>
             <View style={{flex: 1}}>
               <AppText weight="bold" style={{fontSize: 24}}>{category.name}</AppText>
               <AppText muted>{isIncome ? 'আয়' : 'খরচ'} ক্যাটাগরি</AppText>
             </View>
             <View style={[styles.colorDot, {backgroundColor: color}]} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <AppText muted variant="caption">মোট লেনদেন</AppText>
              <AppText weight="bold" style={{fontSize: 18}}>{transactions.length} টি</AppText>
            </View>
            <View style={styles.statBox}>
              <AppText muted variant="caption">মোট পরিমাণ</AppText>
              <AppText weight="bold" style={{fontSize: 18, color: isIncome ? theme.colors.success : theme.colors.danger}}>
                {formatTaka(totalAmount)}
              </AppText>
            </View>
          </View>
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <ChartPanel 
            title="খরচের ট্রেন্ড (Line / Bar)" 
            type="bar" 
            data={chartData} 
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <AppText weight="bold" variant="subtitle" style={{marginBottom: 12}}>সাম্প্রতিক লেনদেন</AppText>
          {transactions.length === 0 ? (
            <AppText muted>কোনো লেনদেন নেই</AppText>
          ) : (
            transactions.slice(0, 10).map(t => (
              <View key={t.id} style={{marginBottom: 8}}>
                <TransactionListItem transaction={t} />
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    gap: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  statBox: {
    flex: 1,
    gap: 4,
  },
  section: {
    gap: 12,
  },
});

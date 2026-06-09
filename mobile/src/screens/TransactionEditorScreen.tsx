import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {z} from 'zod';
import {transactionsApi} from '@/api/transactions';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {Screen} from '@/components/Screen';
import {categoryLabels} from '@/constants/categories';
import {transactionKeys} from '@/hooks/useTransactions';
import {RootStackScreenProps} from '@/navigation/types';
import {CategoryKey, TransactionType} from '@/types';
import {toISODate} from '@/utils/date';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('টাকার পরিমাণ লিখুন'),
  category: z.string().min(1),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
const categories = Object.keys(categoryLabels) as CategoryKey[];

export function TransactionEditorScreen({route, navigation}: RootStackScreenProps<'TransactionEditor'>) {
  const transaction = route.params?.transaction;
  const queryClient = useQueryClient();
  const {control, handleSubmit, setValue, watch, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: transaction?.type ?? 'expense',
      amount: transaction?.amount ?? 0,
      category: transaction?.category ?? 'market',
      note: transaction?.note ?? '',
    },
  });
  const selectedType = watch('type');
  const selectedCategory = watch('category');
  const save = useMutation({
    mutationFn: (values: FormValues) =>
      transaction
        ? transactionsApi.update(transaction.id, {...values, category: values.category, occurredAt: transaction.occurredAt})
        : transactionsApi.create({...values, category: values.category, occurredAt: toISODate()}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: transactionKeys.all});
      navigation.goBack();
    },
  });
  const remove = useMutation({
    mutationFn: () => transactionsApi.remove(transaction?.id ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: transactionKeys.all});
      navigation.goBack();
    },
  });

  const confirmDelete = () => Alert.alert('লেনদেন মুছবেন?', 'এই কাজটি ফিরিয়ে আনা যাবে না।', [
    {text: 'না', style: 'cancel'},
    {text: 'মুছুন', style: 'destructive', onPress: () => remove.mutate()},
  ]);

  return (
    <Screen>
      <AppText variant="title" weight="bold">{transaction ? 'লেনদেন এডিট' : 'নতুন লেনদেন'}</AppText>
      <View style={styles.segment}>
        <AppButton title="খরচ" variant={selectedType === 'expense' ? 'primary' : 'secondary'} onPress={() => setValue('type', 'expense' as TransactionType)} style={styles.segmentButton} />
        <AppButton title="আয়" variant={selectedType === 'income' ? 'primary' : 'secondary'} onPress={() => setValue('type', 'income' as TransactionType)} style={styles.segmentButton} />
      </View>
      <Controller control={control} name="amount" render={({field}) => (
        <AppInput label="পরিমাণ" keyboardType="numeric" value={String(field.value || '')} onChangeText={field.onChange} error={errors.amount?.message} />
      )} />
      <AppText weight="semibold">ক্যাটাগরি</AppText>
      <View style={styles.categories}>
        {categories.map(category => (
          <AppButton
            key={category}
            title={categoryLabels[category]}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            onPress={() => setValue('category', category)}
            style={styles.categoryButton}
          />
        ))}
      </View>
      <Controller control={control} name="note" render={({field}) => (
        <AppInput label="নোট" value={field.value} onChangeText={field.onChange} multiline />
      )} />
      <AppButton title="সেভ করুন" onPress={handleSubmit(values => save.mutate(values))} loading={save.isPending} />
      {transaction ? <AppButton title="ডিলিট" variant="danger" onPress={confirmDelete} loading={remove.isPending} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {flexDirection: 'row', gap: 10},
  segmentButton: {flex: 1},
  categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  categoryButton: {minHeight: 42},
});

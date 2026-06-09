import React from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {budgetsApi} from '@/api/budgets';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {ProgressBar} from '@/components/ProgressBar';
import {Screen} from '@/components/Screen';
import {formatTaka} from '@/utils/currency';

const schema = z.object({
  month: z.string().min(7),
  amount: z.coerce.number().positive(),
  alertThreshold: z.coerce.number().min(1).max(100),
});

type FormValues = z.infer<typeof schema>;

export function BudgetScreen() {
  const queryClient = useQueryClient();
  const budget = useQuery({queryKey: ['budget', 'current'], queryFn: budgetsApi.current});
  const {control, handleSubmit} = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      month: budget.data?.month ?? new Date().toISOString().slice(0, 7),
      amount: budget.data?.amount ?? 0,
      alertThreshold: budget.data?.alertThreshold ?? 80,
    },
  });
  const save = useMutation({
    mutationFn: budgetsApi.upsert,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['budget']}),
  });
  const spent = budget.data?.spent ?? 0;
  const amount = budget.data?.amount ?? 1;
  const percent = Math.round((spent / Math.max(amount, 1)) * 100);

  return (
    <Screen>
      <AppText variant="title" weight="bold">বাজেট</AppText>
      <AppText muted>এই মাসে খরচ হয়েছে {formatTaka(spent)} ({percent}%)</AppText>
      <ProgressBar value={spent} max={amount} tone={percent >= 90 ? 'danger' : percent >= 75 ? 'warning' : 'primary'} />
      <Controller control={control} name="month" render={({field}) => <AppInput label="মাস" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="amount" render={({field}) => <AppInput label="মাসিক বাজেট" keyboardType="numeric" value={String(field.value || '')} onChangeText={field.onChange} />} />
      <Controller control={control} name="alertThreshold" render={({field}) => <AppInput label="এলার্ট সীমা (%)" keyboardType="numeric" value={String(field.value || '')} onChangeText={field.onChange} />} />
      <AppButton title="বাজেট সেভ করুন" onPress={handleSubmit(values => save.mutate(values))} loading={save.isPending} />
    </Screen>
  );
}

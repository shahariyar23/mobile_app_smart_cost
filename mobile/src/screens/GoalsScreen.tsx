import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {goalsApi} from '@/api/goals';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {EmptyState} from '@/components/EmptyState';
import {ProgressBar} from '@/components/ProgressBar';
import {Screen} from '@/components/Screen';
import {formatTaka} from '@/utils/currency';

const schema = z.object({
  title: z.string().min(2),
  targetAmount: z.coerce.number().positive(),
  targetDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function GoalsScreen() {
  const queryClient = useQueryClient();
  const goals = useQuery({queryKey: ['goals'], queryFn: goalsApi.list});
  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {title: '', targetAmount: 0, targetDate: ''},
  });
  const createGoal = useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goals']});
      reset();
    },
  });

  return (
    <Screen>
      <AppText variant="title" weight="bold">সঞ্চয় লক্ষ্য</AppText>
      <Controller control={control} name="title" render={({field}) => <AppInput label="লক্ষ্যের নাম" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="targetAmount" render={({field}) => <AppInput label="টার্গেট টাকা" keyboardType="numeric" value={String(field.value || '')} onChangeText={field.onChange} />} />
      <Controller control={control} name="targetDate" render={({field}) => <AppInput label="টার্গেট তারিখ" placeholder="YYYY-MM-DD" value={field.value} onChangeText={field.onChange} />} />
      <AppButton title="লক্ষ্য তৈরি করুন" onPress={handleSubmit(values => createGoal.mutate(values))} loading={createGoal.isPending} />
      <AppText variant="subtitle" weight="bold">চলমান লক্ষ্য</AppText>
      {goals.data?.length ? goals.data.map(goal => {
        const percent = Math.round((goal.savedAmount / Math.max(goal.targetAmount, 1)) * 100);
        return (
          <View key={goal.id} style={styles.goal}>
            <AppText weight="bold">{goal.title}</AppText>
            <AppText muted>{formatTaka(goal.savedAmount)} / {formatTaka(goal.targetAmount)} - {percent}%</AppText>
            <ProgressBar value={goal.savedAmount} max={goal.targetAmount} tone="success" />
            <AppText variant="caption" muted>সম্ভাব্য সম্পন্ন: {goal.targetDate ?? 'ডেটা যোগ হলে দেখাবে'}</AppText>
          </View>
        );
      }) : <EmptyState title="এখনও কোনো লক্ষ্য নেই" />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  goal: {gap: 8},
});

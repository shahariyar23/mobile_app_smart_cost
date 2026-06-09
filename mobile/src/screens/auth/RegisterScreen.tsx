import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {z} from 'zod';
import {authApi} from '@/api/auth';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {Screen} from '@/components/Screen';
import {AuthStackScreenProps} from '@/navigation/types';

const schema = z.object({
  name: z.string().min(2, 'নাম লিখুন'),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  password: z.string().min(6, 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterScreen({navigation}: AuthStackScreenProps<'Register'>) {
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {name: '', phone: '', password: ''},
  });
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: data => navigation.navigate('OtpVerification', {phone: data.phone}),
  });

  return (
    <Screen>
      <AppText variant="title" weight="bold">অ্যাকাউন্ট তৈরি করুন</AppText>
      <Controller control={control} name="name" render={({field}) => (
        <AppInput label="নাম" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />
      )} />
      <Controller control={control} name="phone" render={({field}) => (
        <AppInput label="ফোন নম্বর" keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} error={errors.phone?.message} />
      )} />
      <Controller control={control} name="password" render={({field}) => (
        <AppInput label="পাসওয়ার্ড" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.password?.message} />
      )} />
      <AppButton title="রেজিস্টার" onPress={handleSubmit(values => register.mutate(values))} loading={register.isPending} />
    </Screen>
  );
}

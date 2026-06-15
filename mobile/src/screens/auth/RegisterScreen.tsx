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
  email: z.string().email('সঠিক ইমেইল দিন'),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  password: z.string().min(6, 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterScreen({navigation}: AuthStackScreenProps<'Register'>) {
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {name: '', email: '', phone: '', password: ''},
  });
  const register = useMutation({
    mutationFn: (values: FormValues) => {
      console.log('📤 STEP 1: Register mutation triggered with values:', values);
      const payload = {username: values.name, email: values.email, password: values.password};
      console.log('📤 STEP 2: Sending payload to backend:', payload);
      return authApi.register(payload);
    },
    onSuccess: (data, variables) => {
      console.log('✅ STEP 4: Backend response received:', data);
      console.log('✅ STEP 5: Navigating to OtpVerification with phone:', variables.phone);
      navigation.navigate('OtpVerification', {phone: variables.phone});
    },
    onError: (error) => {
      console.error('❌ ERROR: Registration failed:', error);
      if (error instanceof Error) console.error('Error message:', error.message);
    },
  });

  return (
    <Screen>
      <AppText variant="title" weight="bold">অ্যাকাউন্ট তৈরি করুন</AppText>
      <Controller control={control} name="name" render={({field}) => (
        <AppInput label="নাম" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />
      )} />
      <Controller control={control} name="email" render={({field}) => (
        <AppInput label="ইমেইল" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={errors.email?.message} />
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

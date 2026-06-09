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
import {setCredentials} from '@/store/slices/authSlice';
import {useAppDispatch} from '@/store/hooks';
import {AuthStackScreenProps} from '@/navigation/types';

const schema = z.object({
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  password: z.string().min(6, 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'),
});

type FormValues = z.infer<typeof schema>;

export function LoginScreen({navigation}: AuthStackScreenProps<'Login'>) {
  const dispatch = useAppDispatch();
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {phone: '', password: ''},
  });
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => dispatch(setCredentials(data)),
  });

  return (
    <Screen>
      <AppText variant="title" weight="bold">স্মার্ট কস্ট</AppText>
      <AppText muted>আপনার আয়, খরচ ও সঞ্চয় বাংলায় ট্র্যাক করুন।</AppText>
      <Controller control={control} name="phone" render={({field}) => (
        <AppInput label="ফোন নম্বর" keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} error={errors.phone?.message} />
      )} />
      <Controller control={control} name="password" render={({field}) => (
        <AppInput label="পাসওয়ার্ড" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.password?.message} />
      )} />
      <AppButton title="লগইন" onPress={handleSubmit(values => login.mutate(values))} loading={login.isPending} />
      <AppButton title="নতুন অ্যাকাউন্ট খুলুন" variant="secondary" onPress={() => navigation.navigate('Register')} />
    </Screen>
  );
}

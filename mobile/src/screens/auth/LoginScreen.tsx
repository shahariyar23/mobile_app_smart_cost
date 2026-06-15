import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {z} from 'zod';
import {authApi} from '@/api/auth';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {Toast} from '@/components/Toast';
import {Screen} from '@/components/Screen';
import {setCredentials} from '@/store/slices/authSlice';
import {useAppDispatch} from '@/store/hooks';
import {AuthStackScreenProps} from '@/navigation/types';

const schema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(6, 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'),
});

type FormValues = z.infer<typeof schema>;

type ToastState = {
  message: string;
  status: 'success' | 'error';
} | null;

export function LoginScreen({navigation}: AuthStackScreenProps<'Login'>) {
  const dispatch = useAppDispatch();
  const [toast, setToast] = React.useState<ToastState>(null);
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {email: '', password: ''},
  });
  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as
        | {detail?: string; message?: string; error?: string}
        | undefined;
      return (
        responseData?.detail || responseData?.message || responseData?.error || error.message || 'কিছু একটা ভুল হয়েছে'
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'কিছু একটা ভুল হয়েছে';
  };

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      dispatch(setCredentials(data));
      setToast({message: 'লগইন সফল হয়েছে', status: 'success'});
    },
    onError: error => {
      const message = getErrorMessage(error);
      setToast({message, status: 'error'});
    },
  });

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <Screen>
      <AppText variant="title" weight="bold">স্মার্ট কস্ট</AppText>
      <AppText muted>আপনার আয়, খরচ ও সঞ্চয় বাংলায় ট্র্যাক করুন।</AppText>
      <Controller control={control} name="email" render={({field}) => (
        <AppInput label="ইমেইল" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={errors.email?.message} />
      )} />
      <Controller control={control} name="password" render={({field}) => (
        <AppInput label="পাসওয়ার্ড" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.password?.message} />
      )} />
      <AppButton title="লগইন" onPress={handleSubmit(values => login.mutate(values))} loading={login.isPending} />
      <AppButton title="নতুন অ্যাকাউন্ট খুলুন" variant="secondary" onPress={() => navigation.navigate('Register')} />
      {toast ? <Toast message={toast.message} status={toast.status} /> : null}
    </Screen>
  );
}

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
import {setCredentials} from '@/store/slices/authSlice';
import {useAppDispatch} from '@/store/hooks';

const schema = z.object({otp: z.string().min(4, 'ওটিপি লিখুন')});
type FormValues = z.infer<typeof schema>;

export function OtpVerificationScreen({route}: AuthStackScreenProps<'OtpVerification'>) {
  const dispatch = useAppDispatch();
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {otp: ''},
  });
  const verify = useMutation({
    mutationFn: (values: FormValues) => authApi.verifyOtp({phone: route.params.phone, otp: values.otp}),
    onSuccess: data => dispatch(setCredentials(data)),
  });

  return (
    <Screen>
      <AppText variant="title" weight="bold">ওটিপি যাচাই</AppText>
      <AppText muted>{route.params.phone} নম্বরে পাঠানো কোড লিখুন।</AppText>
      <Controller control={control} name="otp" render={({field}) => (
        <AppInput label="ওটিপি" keyboardType="number-pad" value={field.value} onChangeText={field.onChange} error={errors.otp?.message} />
      )} />
      <AppButton title="যাচাই করুন" onPress={handleSubmit(values => verify.mutate(values))} loading={verify.isPending} />
    </Screen>
  );
}

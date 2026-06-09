import {apiClient} from '@/api/client';
import {User} from '@/types';

export type LoginPayload = {phone: string; password: string};
export type RegisterPayload = {name: string; phone: string; password: string};
export type OtpPayload = {phone: string; otp: string};
export type AuthResponse = {user: User; accessToken: string};

export const authApi = {
  login: async (payload: LoginPayload) => {
    const {data} = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  register: async (payload: RegisterPayload) => {
    const {data} = await apiClient.post<{phone: string}>('/auth/register', payload);
    return data;
  },
  verifyOtp: async (payload: OtpPayload) => {
    const {data} = await apiClient.post<AuthResponse>('/auth/verify-otp', payload);
    return data;
  },
};

import {apiClient} from '@/api/client';
import {User} from '@/types';

export type LoginPayload = {email: string; password: string};
export type RegisterPayload = {username: string; email: string; password: string};
export type AuthResponse = {user?: User | null; accessToken: string};
type TokenResponse = {access_token: string; token_type: string};

export const authApi = {
  login: async (payload: LoginPayload) => {
    const {data} = await apiClient.post<TokenResponse>('/auth/login', payload);
    return {accessToken: data.access_token, user: null};
  },
  register: async (payload: RegisterPayload) => {
    const {data} = await apiClient.post<User>('/auth/register', payload);
    return data;
  },
};

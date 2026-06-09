import axios from 'axios';
import {env} from '@/config/env';
import {store} from '@/store';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

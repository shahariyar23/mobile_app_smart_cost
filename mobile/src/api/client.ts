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

  console.log('📡 STEP 3: API Request:', {method: config.method?.toUpperCase(), url: config.url, data: config.data});
  return config;
});

apiClient.interceptors.response.use(
  response => {
    console.log('📡 Response received:', {status: response.status, url: response.config.url, data: response.data});
    return response;
  },
  error => {
    const responseData = error.response?.data;
    const errorMessage =
      typeof responseData?.detail === 'string'
        ? responseData.detail
        : typeof responseData?.message === 'string'
        ? responseData.message
        : typeof responseData?.error === 'string'
        ? responseData.error
        : error.message;

    console.error('📡 Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: errorMessage,
      data: responseData,
    });

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

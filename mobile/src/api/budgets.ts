import {apiClient} from '@/api/client';
import {Budget} from '@/types';

export const budgetsApi = {
  current: async () => {
    const {data} = await apiClient.get<Budget[]>('/budgets');
    return data[0] ?? null;
  },
  list: async () => {
    const {data} = await apiClient.get<Budget[]>('/budgets');
    return data;
  },
  upsert: async (payload: Pick<Budget, 'month' | 'amount' | 'alertThreshold'>) => {
    const {data} = await apiClient.post<Budget>('/budgets', payload);
    return data;
  },
};

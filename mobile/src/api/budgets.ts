import {apiClient} from '@/api/client';
import {Budget} from '@/types';

export const budgetsApi = {
  current: async () => {
    const {data} = await apiClient.get<Budget>('/budgets/current');
    return data;
  },
  upsert: async (payload: Pick<Budget, 'month' | 'amount' | 'alertThreshold'>) => {
    const {data} = await apiClient.post<Budget>('/budgets', payload);
    return data;
  },
};

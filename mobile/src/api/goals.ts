import {apiClient} from '@/api/client';
import {SavingsGoal} from '@/types';

export const goalsApi = {
  list: async () => {
    const {data} = await apiClient.get<SavingsGoal[]>('/goals');
    return data;
  },
  create: async (payload: Omit<SavingsGoal, 'id' | 'savedAmount'>) => {
    const {data} = await apiClient.post<SavingsGoal>('/goals', payload);
    return data;
  },
};

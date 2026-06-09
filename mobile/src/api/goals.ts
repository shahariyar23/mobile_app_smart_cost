import {apiClient} from '@/api/client';
import {SavingsGoal} from '@/types';

export const goalsApi = {
  list: async () => {
    const {data} = await apiClient.get<SavingsGoal[]>('/savings-goals');
    return data;
  },
  create: async (payload: Omit<SavingsGoal, 'id' | 'savedAmount'>) => {
    const {data} = await apiClient.post<SavingsGoal>('/savings-goals', payload);
    return data;
  },
};

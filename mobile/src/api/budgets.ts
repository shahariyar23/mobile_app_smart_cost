import {apiClient} from '@/api/client';
import {Budget} from '@/types';

function getMonthRange(month: string) {
  const [year, monthIndex] = month.split('-').map(Number);
  const firstDay = new Date(year, monthIndex - 1, 1);
  const lastDay = new Date(year, monthIndex, 0);

  const format = (date: Date) => date.toISOString().split('T')[0];
  return {start_date: format(firstDay), end_date: format(lastDay)};
}

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
    const {start_date, end_date} = getMonthRange(payload.month);
    const body = {
      user_id: 1,
      category_id: null,
      amount: payload.amount,
      period: payload.month,
      start_date,
      end_date,
    };

    const {data} = await apiClient.post<Budget>('/budgets', body);
    return data;
  },
};

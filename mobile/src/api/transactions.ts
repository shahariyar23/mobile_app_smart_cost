import {apiClient} from '@/api/client';
import {Transaction, TransactionType} from '@/types';

export type TransactionPayload = {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  occurredAt: string;
};

export type TransactionFilters = {
  search?: string;
  type?: TransactionType | 'all';
  category?: string;
  from?: string;
  to?: string;
};

export const transactionsApi = {
  list: async (filters?: TransactionFilters) => {
    const {data} = await apiClient.get<Transaction[]>('/transactions', {params: filters});
    return data;
  },
  create: async (payload: TransactionPayload) => {
    const {data} = await apiClient.post<Transaction>('/transactions', payload);
    return data;
  },
  update: async (id: string, payload: TransactionPayload) => {
    const {data} = await apiClient.put<Transaction>(`/transactions/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

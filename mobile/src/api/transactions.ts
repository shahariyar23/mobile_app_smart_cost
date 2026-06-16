import {apiClient} from '@/api/client';
import {CategoryKey, Transaction, TransactionType} from '@/types';

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

type ApiTransaction = {
  id: number;
  user_id: number;
  category_id: number | null;
  category?: string | null;
  amount: number | string;
  type: TransactionType;
  note?: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

type ApiTransactionPayload = {
  user_id: number;
  category_id: number | null;
  category: string;
  amount: number;
  type: TransactionType;
  note?: string;
  transaction_date: string;
};

const categoryKeys = new Set<CategoryKey>([
  'salary',
  'business',
  'market',
  'transport',
  'food',
  'rent',
  'utilities',
  'health',
  'education',
  'shopping',
  'savings',
  'other',
]);

function toCategoryKey(category?: string | null): CategoryKey {
  return categoryKeys.has(category as CategoryKey) ? (category as CategoryKey) : 'other';
}

function toApiPayload(payload: TransactionPayload): ApiTransactionPayload {
  return {
    user_id: 1,
    category_id: null,
    category: payload.category,
    amount: payload.amount,
    type: payload.type,
    note: payload.note,
    transaction_date: payload.occurredAt.split('T')[0],
  };
}

function fromApiTransaction(transaction: ApiTransaction): Transaction {
  return {
    id: String(transaction.id),
    type: transaction.type,
    amount: Number(transaction.amount),
    category: toCategoryKey(transaction.category),
    note: transaction.note ?? undefined,
    occurredAt: transaction.transaction_date,
  };
}

export const transactionsApi = {
  list: async (filters?: TransactionFilters) => {
    const {data} = await apiClient.get<ApiTransaction[]>('/transactions', {params: filters});
    return data.map(fromApiTransaction);
  },
  create: async (payload: TransactionPayload) => {
    const {data} = await apiClient.post<ApiTransaction>('/transactions', toApiPayload(payload));
    return fromApiTransaction(data);
  },
  update: async (id: string, payload: TransactionPayload) => {
    const {data} = await apiClient.put<ApiTransaction>(`/transactions/${id}`, toApiPayload(payload));
    return fromApiTransaction(data);
  },
  remove: async (id: string) => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

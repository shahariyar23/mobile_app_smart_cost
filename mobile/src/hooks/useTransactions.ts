import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {transactionsApi, TransactionFilters, TransactionPayload} from '@/api/transactions';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filters?: TransactionFilters) => [...transactionKeys.all, filters] as const,
  summary: ['transactions', 'summary'] as const,
};

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsApi.list(filters),
  });
}

export function useFinancialSummary() {
  return useQuery({
    queryKey: transactionKeys.summary,
    queryFn: transactionsApi.summary,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionPayload) => transactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: transactionKeys.all});
      queryClient.invalidateQueries({queryKey: transactionKeys.summary});
    },
  });
}

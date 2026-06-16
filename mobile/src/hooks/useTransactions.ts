import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {transactionsApi, TransactionFilters, TransactionPayload} from '@/api/transactions';
import {reportsApi, ReportSummary} from '@/api/reports';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filters?: TransactionFilters) => [...transactionKeys.all, filters] as const,
  summary: ['transactions', 'summary'] as const,
};

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsApi.list(filters),
  });
}

export function useFinancialSummary() {
  return useQuery({
    queryKey: transactionKeys.summary,
    queryFn: async () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const report = await reportsApi.summary({
        user_id: 1,
        start_date: formatDate(firstDay),
        end_date: formatDate(lastDay),
      });

      return {
        currentBalance: report.totalIncome - report.totalExpense,
        monthlyIncome: report.totalIncome,
        monthlyExpense: report.totalExpense,
        savings: Math.max(0, report.totalIncome - report.totalExpense),
        categoryBreakdown: report.categoryBreakdown,
      };
    },
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

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {budgetsApi} from '@/api/budgets';

export const budgetKeys = {
  all: ['budgets'] as const,
  current: () => [...budgetKeys.all, 'current'] as const,
  list: (filters?: any) => [...budgetKeys.all, 'list', filters] as const,
  summary: (id: number) => [...budgetKeys.all, 'summary', id] as const,
  alerts: () => [...budgetKeys.all, 'alerts'] as const,
  analytics: () => [...budgetKeys.all, 'analytics'] as const,
  recommendation: (id: number) => [...budgetKeys.all, 'recommendation', id] as const,
  score: () => [...budgetKeys.all, 'score'] as const,
  history: () => [...budgetKeys.all, 'history'] as const,
};

export function useCurrentBudget() {
  return useQuery({
    queryKey: budgetKeys.current(),
    queryFn: budgetsApi.current,
  });
}

export function useBudgetsList(filters?: {category_id?: number | null; month?: string}) {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetsApi.list(filters),
  });
}

export function useBudgetSummary(id: number | undefined) {
  return useQuery({
    queryKey: budgetKeys.summary(id!),
    queryFn: () => budgetsApi.getSummary(id!),
    enabled: !!id,
  });
}

export function useBudgetAlerts() {
  return useQuery({
    queryKey: budgetKeys.alerts(),
    queryFn: budgetsApi.getAlerts,
  });
}

export function useBudgetAnalytics() {
  return useQuery({
    queryKey: budgetKeys.analytics(),
    queryFn: budgetsApi.getAnalytics,
  });
}

export function useBudgetRecommendation(id: number | undefined) {
  return useQuery({
    queryKey: budgetKeys.recommendation(id!),
    queryFn: () => budgetsApi.getRecommendation(id!),
    enabled: !!id,
  });
}

export function useBudgetScore() {
  return useQuery({
    queryKey: budgetKeys.score(),
    queryFn: budgetsApi.getScore,
  });
}

export function useBudgetHistory() {
  return useQuery({
    queryKey: budgetKeys.history(),
    queryFn: budgetsApi.getHistory,
  });
}

export function useCheckBudgetAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.checkAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: budgetKeys.alerts()});
    },
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.markAlertRead,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: budgetKeys.alerts()});
    },
  });
}

export function useCreateHistorySnapshot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.createHistorySnapshot,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: budgetKeys.history()});
    },
  });
}

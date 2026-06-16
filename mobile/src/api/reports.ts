import {apiClient} from '@/api/client';
import {ReportRange} from '@/types';

export type ReportSummary = {
  totalExpense: number;
  totalIncome: number;
  categoryBreakdown: Record<string, number>;
};

type ApiReportSummary = {
  total_expense: number;
  total_income: number;
  category_breakdown: Record<string, number>;
};

function fromApiReportSummary(summary: ApiReportSummary): ReportSummary {
  return {
    totalExpense: summary.total_expense,
    totalIncome: summary.total_income,
    categoryBreakdown: summary.category_breakdown,
  };
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function rangeToDates(range: ReportRange) {
  const now = new Date();
  if (range === 'weekly') {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
    return {start_date: formatDate(startDate), end_date: formatDate(now)};
  }
  if (range === 'yearly') {
    return {
      start_date: formatDate(new Date(now.getFullYear(), 0, 1)),
      end_date: formatDate(new Date(now.getFullYear(), 11, 31)),
    };
  }
  return {
    start_date: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
    end_date: formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export const reportsApi = {
  summary: async (payload: {user_id: number; start_date: string; end_date: string}) => {
    const {data} = await apiClient.post<ApiReportSummary>('/reports/summary', payload);
    return fromApiReportSummary(data);
  },
  get: async (range: ReportRange) => {
    const dates = rangeToDates(range);
    const {data} = await apiClient.post<ApiReportSummary>('/reports/summary', {
      user_id: 1,
      ...dates,
    });
    return fromApiReportSummary(data);
  },
};

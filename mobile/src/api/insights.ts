import {apiClient} from '@/api/client';

export type InsightResponse = {
  financialScore: number;
  spendingAnalysis: string[];
  savingSuggestions: string[];
};

export const insightsApi = {
  monthly: async () => {
    const {data} = await apiClient.get<InsightResponse>('/ai-insights/monthly');
    return data;
  },
};

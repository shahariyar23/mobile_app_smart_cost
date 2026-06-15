import {apiClient} from '@/api/client';

export type InsightResponse = Array<{
  id: string;
  insightType: string;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}>;

export const insightsApi = {
  monthly: async () => {
    const {data} = await apiClient.get<InsightResponse>('/ai-insights');
    return data;
  },
};

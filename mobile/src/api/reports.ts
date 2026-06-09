import {apiClient} from '@/api/client';
import {ReportRange} from '@/types';

export type ReportPoint = {label: string; income: number; expense: number};

export const reportsApi = {
  get: async (range: ReportRange) => {
    const {data} = await apiClient.get<ReportPoint[]>('/reports', {params: {range}});
    return data;
  },
};

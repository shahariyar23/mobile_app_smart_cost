import {apiClient} from '@/api/client';

export type Category = {
  id: number;
  name: string;
  type: string;
  icon?: string | null;
  color?: string | null;
};

export type CategoryPayload = {
  name: string;
  type: string;
  icon?: string | null;
  color?: string | null;
};

export const categoriesApi = {
  list: async () => {
    const {data} = await apiClient.get<Category[]>('/categories');
    return data;
  },
  create: async (payload: CategoryPayload) => {
    const {data} = await apiClient.post<Category>('/categories/', payload);
    return data;
  },
  update: async (id: number, payload: Partial<CategoryPayload>) => {
    const {data} = await apiClient.put<Category>(`/categories/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/categories/${id}`);
  },
};

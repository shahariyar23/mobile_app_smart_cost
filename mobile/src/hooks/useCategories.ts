import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {categoriesApi, CategoryPayload} from '@/api/categories';
import {transactionKeys} from '@/hooks/useTransactions';

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.list(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: categoryKeys.all});
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, payload}: {id: number; payload: Partial<CategoryPayload>}) =>
      categoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: categoryKeys.all});
      queryClient.invalidateQueries({queryKey: transactionKeys.all});
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: categoryKeys.all});
      queryClient.invalidateQueries({queryKey: transactionKeys.all});
    },
  });
}

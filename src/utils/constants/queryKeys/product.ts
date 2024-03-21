export const productQueryKeys = {
  all: ['product'] as const,
  details: () => [...productQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...productQueryKeys.details(), id] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  listAll: () => [...productQueryKeys.lists(), 'all'] as const,
};

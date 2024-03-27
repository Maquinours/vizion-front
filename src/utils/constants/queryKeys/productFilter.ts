export const productFilterQueryKeys = {
  all: ['product-filters'] as const,
  lists: () => [...productFilterQueryKeys.all, 'list'] as const,
  listAll: () => [...productFilterQueryKeys.lists(), 'all'] as const,
  details: () => [...productFilterQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...productFilterQueryKeys.details(), { id }] as const,
};

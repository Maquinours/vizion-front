export const businessQueryKeys = {
  all: ['business'] as const,
  details: () => [...businessQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...businessQueryKeys.details(), id] as const,
};

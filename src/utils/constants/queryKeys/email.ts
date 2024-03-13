export const emailQueryKeys = {
  all: ['emails'] as const,
  details: () => [...emailQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...emailQueryKeys.details(), { id }] as const,
};

export const rmaQueryKeys = {
  all: ['rma'] as const,
  details: () => [...rmaQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...rmaQueryKeys.details(), { id }] as const,
};

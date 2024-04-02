export const rdvQueryKeys = {
  all: ['rdv'] as const,
  details: () => [...rdvQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...rdvQueryKeys.details(), { id }] as const,
};

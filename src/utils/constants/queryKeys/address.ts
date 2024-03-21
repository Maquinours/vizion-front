export const addressQueryKeys = {
  all: ['address'] as const,
  details: () => [...addressQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...addressQueryKeys.details(), { id }] as const,
  pages: () => [...addressQueryKeys.all, 'page'] as const,
  pageByEnterpriseIdWithSearch: (enterpriseId: string, search: string, page: number, size: number) =>
    [...addressQueryKeys.pages(), { enterpriseId, search, page, size }] as const,
};

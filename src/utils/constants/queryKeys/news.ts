export const newsQueryKeys = {
  all: ['news'] as const,
  pages: () => [...newsQueryKeys.all, 'page'] as const,
  page: (page: number, size: number) => [...newsQueryKeys.pages(), { page, size }] as const,
  details: () => [...newsQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...newsQueryKeys.details(), { id }] as const,
};

export const allBusinessQueryKeys = {
  all: ['all-business'] as const,
  lists: () => [...allBusinessQueryKeys.all, 'list'] as const,
  listAll: () => [...allBusinessQueryKeys.lists(), 'all'] as const,
  pages: () => [...allBusinessQueryKeys.all, 'page'] as const,
  pageByEnterpriseId: (enterpriseId: string, page: number, size: number) => [...allBusinessQueryKeys.pages(), { enterpriseId, page, size }] as const,
};
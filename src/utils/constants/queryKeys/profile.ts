import CategoryClient from '../../enums/CategoryClient';

export const profileQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...profileQueryKeys.all, 'list'] as const,
  listByEnterpriseId: (enterpriseId: string) => [...profileQueryKeys.lists(), { enterpriseId }] as const,
  listByCategory: (category: CategoryClient) => [...profileQueryKeys.lists(), { category }] as const,
  details: () => [...profileQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...profileQueryKeys.details(), { id }] as const,
  pages: () => [...profileQueryKeys.all, 'page'] as const,
  pageByEnterpriseIdAndSearch: (enterpriseId: string, search: string | undefined, page: number, size: number) =>
    [...profileQueryKeys.pages(), { enterpriseId, search, page, size }] as const,
};

import CategoryClient from '../../enums/CategoryClient';

export const profileQueryKeys = {
  all: ['tasks'] as const,
  list: () => [...profileQueryKeys.all, 'list'] as const,
  listByEnterpriseId: (enterpriseId: string) => [...profileQueryKeys.list(), { enterpriseId }] as const,
  listByCategory: (category: CategoryClient) => [...profileQueryKeys.list(), { category }] as const,
  details: () => [...profileQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...profileQueryKeys.details(), { id }] as const,
};

import CategoryClient from '../../enums/CategoryClient';

const enterpriseQueryKeys = {
  all: ['enterprises'] as const,
  list: () => [...enterpriseQueryKeys.all, 'list'] as const,
  listByCategory: (category: CategoryClient) => [...enterpriseQueryKeys.list(), { category }] as const,
  details: () => [...enterpriseQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...enterpriseQueryKeys.details(), { id }] as const,
};

export default enterpriseQueryKeys;

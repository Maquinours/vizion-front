import CategoryClient from '../../enums/CategoryClient';

const enterpriseQueryKeys = {
  all: ['enterprises'] as const,
  list: () => [...enterpriseQueryKeys.all, 'list'] as const,
  listByCategory: (category: CategoryClient) => [...enterpriseQueryKeys.list(), { category }] as const,
};

export default enterpriseQueryKeys;

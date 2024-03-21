import CategoryClient from '../../enums/CategoryClient';

type SearchPaginatedEnterprisesParams = {
  enterprise?: string;
  contact?: string;
  zipCode?: string;
  city?: string;
  phoneNumber?: string;
  representativeId?: string;
  category?: CategoryClient;
  page: number;
  size: number;
};

const enterpriseQueryKeys = {
  all: ['enterprises'] as const,
  lists: () => [...enterpriseQueryKeys.all, 'list'] as const,
  listAll: () => [...enterpriseQueryKeys.lists(), 'all'] as const,
  listByCategory: (category: CategoryClient) => [...enterpriseQueryKeys.lists(), { category }] as const,
  details: () => [...enterpriseQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...enterpriseQueryKeys.details(), { id }] as const,
  pages: () => [...enterpriseQueryKeys.all, 'page'] as const,
  pageWithSearch: ({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }: SearchPaginatedEnterprisesParams) =>
    [...enterpriseQueryKeys.pages(), { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }] as const,
};

export default enterpriseQueryKeys;

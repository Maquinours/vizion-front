import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getEnterpriseById, getEnterprises, getProviderEnterprises, searchPaginatedEnterprises } from '../../api/enterprise';
import { getEnterprisesByCategory } from '../../api/enterprises';
import { getProfilesByCategory, getProfilesByEnterpriseId, getProfilesPageByEnterpriseId, getProfilesPageByEnterpriseIdAndSearch } from '../../api/profile';
import CategoryClient from '../../enums/CategoryClient';

export const enterprises = createQueryKeys('enterprise', {
  list: {
    queryKey: null,
    queryFn: getEnterprises,
    contextQueries: {
      byCategory: (category: CategoryClient) => ({
        queryKey: [{ category }],
        queryFn: () => getEnterprisesByCategory(category),
        contextQueries: {
          profiles: {
            queryKey: null,
            contextQueries: {
              // eslint-disable-next-line @tanstack/query/exhaustive-deps
              list: { queryKey: null, queryFn: () => getProfilesByCategory(category) },
            },
          },
        },
      }),
      providers: { queryKey: [{ provider: true }], queryFn: getProviderEnterprises },
    },
  },
  detail: (id: string) => ({
    queryKey: [{ id }],
    queryFn: () => getEnterpriseById(id),
    contextQueries: {
      profiles: {
        queryKey: null,
        contextQueries: {
          // eslint-disable-next-line @tanstack/query/exhaustive-deps
          list: { queryKey: null, queryFn: () => getProfilesByEnterpriseId(id) },
          page: ({ page, size }: { page: number; size: number }) => ({
            queryKey: [page, size],
            contextQueries: {
              search: (searchText: string) => ({
                // eslint-disable-next-line @tanstack/query/exhaustive-deps
                queryKey: [searchText],
                queryFn: () =>
                  searchText ? getProfilesPageByEnterpriseIdAndSearch(id, searchText, page, size) : getProfilesPageByEnterpriseId(id, page, size),
              }),
            },
          }),
        },
      },
    },
  }),
  page: ({
    enterprise,
    contact,
    zipCode,
    city,
    phoneNumbers,
    category,
    representativeId,
    fuzzy,
    page,
    size,
  }: {
    enterprise?: string;
    contact?: string;
    zipCode?: string;
    city?: string;
    phoneNumbers?: Array<string>;
    representativeId?: string;
    category?: CategoryClient;
    fuzzy: boolean;
    page: number;
    size: number;
  }) => ({
    queryKey: [{ enterprise, contact, zipCode, city, phoneNumbers, category, representativeId, fuzzy, page, size }],
    queryFn: () => searchPaginatedEnterprises({ enterprise, contact, zipCode, city, phoneNumbers, category, representativeId, fuzzy, page, size }),
  }),
});

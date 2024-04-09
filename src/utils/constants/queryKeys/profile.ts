import { createQueryKeys } from '@lukemorales/query-key-factory';
import CategoryClient from '../../enums/CategoryClient';
import {
  getProfileById,
  getProfilesByCategory,
  getProfilesByEnterpriseId,
  getProfilesPageByEnterpriseId,
  getProfilesPageByEnterpriseIdAndSearch,
} from '../../api/profile';

export const profiles = createQueryKeys('profiles', {
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getProfileById(id),
  }),
  list: {
    queryKey: null,
    contextQueries: {
      byEnterpriseId: (enterpriseId: string) => ({
        queryKey: [enterpriseId],
        queryFn: () => getProfilesByEnterpriseId(enterpriseId),
      }),
      byCategory: (category: CategoryClient) => ({
        queryKey: [category],
        queryFn: () => getProfilesByCategory(category),
      }),
    },
  },
  page: {
    queryKey: null,
    contextQueries: {
      byEnterpriseIdAndSearch: (enterpriseId: string, searchText: string | undefined, { page, size }: { page: number; size: number }) => ({
        queryKey: [enterpriseId, searchText, page, size],
        queryFn: () =>
          searchText ? getProfilesPageByEnterpriseIdAndSearch(enterpriseId, searchText, page, size) : getProfilesPageByEnterpriseId(enterpriseId, page, size),
      }),
    },
  },
});

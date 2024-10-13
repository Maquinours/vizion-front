import { createQueryKeys } from '@lukemorales/query-key-factory';
import CategoryClient from '../../enums/CategoryClient';
import {
  getProfileById,
  getProfilesByCategory,
  getProfilesByEnterpriseId,
  getProfilesByIds,
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
      byIds: (ids: Array<string>) => ({
        queryKey: [ids],
        queryFn: () => (ids.length > 0 ? getProfilesByIds(ids) : Promise.resolve([])),
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

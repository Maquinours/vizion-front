import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAddressById, searchPaginatedAddressesByEnterpriseId } from '../../api/address';

export const addresses = createQueryKeys('address', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getAddressById(id),
      }),
    },
  },
  page: {
    queryKey: null,
    contextQueries: {
      searchByEnterpriseId: (
        { enterpriseId, searchText }: { enterpriseId: string; searchText: string | undefined },
        { page, size }: { page: number; size: number },
      ) => ({
        queryKey: [enterpriseId, searchText, page, size],
        queryFn: () => searchPaginatedAddressesByEnterpriseId(enterpriseId, searchText ?? '', page, size),
      }),
    },
  },
});

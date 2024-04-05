import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAddressById, searchPaginatedAddressesByEnterpriseId } from '../../api/address';

export const addresses = createQueryKeys('address', {
  detail: ({ id }: { id: string }) => ({ queryKey: [{ id }], queryFn: () => getAddressById(id) }),
  page: ({ enterpriseId, search, page, size }: { enterpriseId: string; search: string; page: number; size: number }) => ({
    queryKey: [{ enterpriseId, search, page, size }],
    queryFn: () => searchPaginatedAddressesByEnterpriseId(enterpriseId, search, page, size),
  }),
});

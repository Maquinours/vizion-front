import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllBusinessPageByEnterpriseId, getAllBusinesses } from '../../api/allBusiness';

export const allBusinesses = createQueryKeys('allBusiness', {
  list: { queryKey: null, queryFn: getAllBusinesses },
  page: ({ enterpriseId, page, size }: { enterpriseId: string; page: number; size: number }) => ({
    queryKey: [{ enterpriseId, page, size }],
    queryFn: () => getAllBusinessPageByEnterpriseId(enterpriseId, page, size),
  }),
});

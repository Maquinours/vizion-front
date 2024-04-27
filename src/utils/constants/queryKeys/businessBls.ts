import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessBlsByBusinessId } from '../../api/businessBls';

export const businessBls = createQueryKeys('business-bls', {
  list: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({
        queryKey: [businessId],
        queryFn: () => getBusinessBlsByBusinessId(businessId),
      }),
    },
  },
});

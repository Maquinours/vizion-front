import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessBpByBusinessId } from '../../api/businessBps';

export const businessBps = createQueryKeys('business-bps', {
  detail: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({
        queryKey: [businessId],
        queryFn: () => getBusinessBpByBusinessId(businessId),
      }),
    },
  },
});

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getSynopticBusinessByBusinessId } from '../../api/synoptic';

export const synopticBusinessQueryKeys = createQueryKeys('synoptic-business', {
  detail: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({
        queryKey: [businessId],
        queryFn: () => getSynopticBusinessByBusinessId(businessId),
      }),
    },
  },
});

import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessArcByBusinessId } from '../../api/businessArcs';

export const businessArcs = createQueryKeys('business-ARCs', {
  detail: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({
        queryKey: [businessId],
        queryFn: () => getBusinessArcByBusinessId(businessId),
      }),
    },
  },
});
